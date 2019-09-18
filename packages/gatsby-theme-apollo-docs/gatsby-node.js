const jsYaml = require('js-yaml');
const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');
const {getVersionBasePath} = require('./src/utils');

async function onCreateNode({node, actions, getNode, loadNodeContent}) {
  if (configPaths.includes(node.relativePath)) {
    const value = await loadNodeContent(node);
    actions.createNodeField({
      name: 'raw',
      node,
      value
    });
  }

  if (['MarkdownRemark', 'Mdx'].includes(node.internal.type)) {
    let version = 'default';
    let slug = createFilePath({
      node,
      getNode
    });

    const parent = getNode(node.parent);
    if (parent.gitRemote___NODE) {
      const gitRemote = getNode(parent.gitRemote___NODE);
      version = gitRemote.sourceInstanceName;
      slug = slug.replace(/^\/docs\/source/, getVersionBasePath(version));
    }

    actions.createNodeField({
      name: 'version',
      node,
      value: version
    });

    actions.createNodeField({
      name: 'slug',
      node,
      value: slug
    });
  }
}

exports.onCreateNode = onCreateNode;

function getPageFromEdge({node}) {
  return node.childMarkdownRemark || node.childMdx;
}

function getSidebarContents(sidebarCategories, edges, version, contentDir) {
  return Object.keys(sidebarCategories).map(key => ({
    title: key === 'null' ? null : key,
    pages: sidebarCategories[key]
      .map(linkPath => {
        const match = linkPath.match(/^\[(.+)\]\((https?:\/\/.+)\)$/);
        if (match) {
          return {
            anchor: true,
            title: match[1],
            path: match[2]
          };
        }

        const edge = edges.find(edge => {
          const {relativePath} = edge.node;
          const {fields} = getPageFromEdge(edge);
          return (
            fields.version === version &&
            relativePath
              .slice(0, relativePath.lastIndexOf('.'))
              .replace(new RegExp(`^${contentDir}/`), '') === linkPath
          );
        });

        if (!edge) {
          return null;
        }

        const {frontmatter, fields} = getPageFromEdge(edge);
        return {
          title: frontmatter.title,
          path: fields.slug
        };
      })
      .filter(Boolean)
  }));
}

const configPaths = [
  'docs/gatsby-config.js', // new gatsby config
  'docs/_config.yml' // old hexo config
];

function getVersionSidebarCategories(gatsbyConfig, hexoConfig) {
  if (gatsbyConfig) {
    const trimmed = gatsbyConfig.slice(
      gatsbyConfig.indexOf('sidebarCategories')
    );

    const json = trimmed
      .slice(0, trimmed.indexOf('}'))
      // wrap object keys in double quotes
      .replace(/['"]?(\w[\w\s]+)['"]?:/g, '"$1":')
      // replace single-quoted array values with double quoted ones
      .replace(/'([\w-/.]+)'/g, '"$1"')
      // remove trailing commas
      .trim()
      .replace(/,\s*\]/g, ']')
      .replace(/,\s*$/, '');

    const {sidebarCategories} = JSON.parse(`{${json}}}`);
    return sidebarCategories;
  }

  const {sidebar_categories} = jsYaml.load(hexoConfig);
  return sidebar_categories;
}

const pageFragment = `
  internal {
    type
  }
  frontmatter {
    title
  }
  fields {
    slug
    version
  }
`;

exports.createPages = async ({actions, graphql}, options) => {
  const {data} = await graphql(`
    {
      allFile(filter: {extension: {in: ["md", "mdx"]}}) {
        edges {
          node {
            id
            relativePath
            childMarkdownRemark {
              ${pageFragment}
            }
            childMdx {
              ${pageFragment}
            }
          }
        }
      }
    }
  `);

  const {
    contentDir = 'docs/source',
    githubRepo,
    sidebarCategories,
    spectrumPath,
    typescriptApiBox,
    versions = {},
    defaultVersion,
    baseUrl
  } = options;

  const {edges} = data.allFile;
  const sidebarContents = {
    default: getSidebarContents(sidebarCategories, edges, 'default', contentDir)
  };

  const versionKeys = [];
  for (const version in versions) {
    versionKeys.push(version);

    // grab the old config files for each older version
    const configs = await Promise.all(
      configPaths.map(async configPath => {
        const response = await graphql(`
          {
            file(
              relativePath: {eq: "${configPath}"}
              gitRemote: {sourceInstanceName: {eq: "${version}"}}
            ) {
              fields {
                raw
              }
            }
          }
        `);

        const {file} = response.data;
        return file && file.fields.raw;
      })
    );

    sidebarContents[version] = getSidebarContents(
      getVersionSidebarCategories(...configs),
      edges,
      version,
      contentDir
    );
  }

  const [owner, repo] = githubRepo.split('/');
  const template = require.resolve('./src/components/template');
  edges.forEach(edge => {
    const {id, relativePath} = edge.node;
    const {fields} = getPageFromEdge(edge);
    actions.createPage({
      path: fields.slug,
      component: template,
      context: {
        id,
        sidebarContents: sidebarContents[fields.version],
        githubUrl:
          'https://' +
          path.join(
            'github.com',
            owner,
            repo,
            'tree',
            'master',
            contentDir,
            relativePath
          ),
        spectrumPath: spectrumPath || repo,
        typescriptApiBox,
        versions: versionKeys, // only need to send version labels to client
        defaultVersion,
        baseUrl
      }
    });
  });
};
