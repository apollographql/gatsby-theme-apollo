const jsYaml = require('js-yaml');
const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');
const {getVersionBasePath, getSpectrumUrl} = require('./src/utils');
const {createPrinterNode} = require('gatsby-plugin-printer');

function getConfigPaths(baseDir) {
  return [
    path.join(baseDir, 'gatsby-config.js'), // new gatsby config
    path.join(baseDir, '_config.yml') // old hexo config
  ];
}

async function onCreateNode(
  {node, actions, getNode, loadNodeContent},
  {
    localVersion,
    defaultVersion,
    siteName,
    baseDir = '',
    contentDir = 'source',
    subtitle,
    sidebarCategories
  }
) {
  const configPaths = getConfigPaths(baseDir);
  if (configPaths.includes(node.relativePath)) {
    const value = await loadNodeContent(node);
    actions.createNodeField({
      name: 'raw',
      node,
      value
    });
  }

  if (['MarkdownRemark', 'Mdx'].includes(node.internal.type)) {
    const parent = getNode(node.parent);
    let version = localVersion || defaultVersion;
    let slug = createFilePath({
      node,
      getNode
    });

    let category;
    const fileName = parent.name;
    const outputDir = 'social-cards';

    for (const key in sidebarCategories) {
      if (key !== 'null') {
        const categories = sidebarCategories[key];
        const trimmedSlug = slug.replace(/^\/|\/$/g, '');
        if (categories.includes(trimmedSlug)) {
          category = key;
          break;
        }
      }
    }

    const {title, sidebar_title, graphManagerUrl} = node.frontmatter;
    createPrinterNode({
      id: `${node.id} >>> Printer`,
      fileName,
      outputDir,
      data: {
        title: title || siteName,
        subtitle,
        category
      },
      component: require.resolve('./src/components/social-card.js')
    });

    actions.createNodeField({
      name: 'image',
      node,
      value: path.join(outputDir, fileName + '.png')
    });

    if (parent.gitRemote___NODE) {
      const gitRemote = getNode(parent.gitRemote___NODE);
      version = gitRemote.sourceInstanceName;

      const dirPattern = new RegExp(path.join('^', baseDir, contentDir));
      slug = slug.replace(dirPattern, '');
    }

    if (version !== defaultVersion) {
      slug = getVersionBasePath(version) + slug;
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

    actions.createNodeField({
      name: 'sidebarTitle',
      node,
      value: sidebar_title || ''
    });

    actions.createNodeField({
      name: 'graphManagerUrl',
      node,
      value: graphManagerUrl || ''
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
          title: fields.sidebarTitle || frontmatter.title,
          description: frontmatter.description,
          path: fields.slug
        };
      })
      .filter(Boolean)
  }));
}

function getVersionSidebarCategories(gatsbyConfig, hexoConfig) {
  if (gatsbyConfig) {
    const trimmed = gatsbyConfig.slice(
      gatsbyConfig.indexOf('sidebarCategories')
    );

    const json = trimmed
      .slice(0, trimmed.indexOf('}'))
      // wrap object keys in double quotes
      .replace(/['"]?(\w[\w\s&-]+)['"]?:/g, '"$1":')
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
    description
  }
  fields {
    slug
    version
    sidebarTitle
  }
`;

exports.createPages = async (
  {actions, graphql},
  {
    baseDir = '',
    contentDir = 'source',
    githubRepo,
    sidebarCategories,
    spectrumHandle,
    spectrumPath,
    typescriptApiBox,
    versions = {},
    localVersion,
    defaultVersion,
    baseUrl
  }
) => {
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

  const {edges} = data.allFile;
  const mainVersion = localVersion || defaultVersion;
  const sidebarContents = {
    [mainVersion]: getSidebarContents(
      sidebarCategories,
      edges,
      mainVersion,
      contentDir
    )
  };

  const configPaths = getConfigPaths(baseDir);
  const versionKeys = [localVersion].filter(Boolean);
  for (const version in versions) {
    if (version !== defaultVersion) {
      versionKeys.push(version);
    }

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

  let defaultVersionNumber = null;
  try {
    defaultVersionNumber = parseFloat(defaultVersion, 10);
  } catch (error) {
    // let it slide
  }

  const [owner, repo] = githubRepo.split('/');
  const template = require.resolve('./src/components/template');
  edges.forEach(edge => {
    const {id, relativePath} = edge.node;
    const {fields} = getPageFromEdge(edge);

    let versionDifference = 0;
    if (defaultVersionNumber) {
      try {
        const versionNumber = parseFloat(fields.version, 10);
        versionDifference = versionNumber - defaultVersionNumber;
      } catch (error) {
        // do nothing
      }
    }

    actions.createPage({
      path: fields.slug,
      component: template,
      context: {
        id,
        versionDifference,
        versionBasePath: getVersionBasePath(fields.version),
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
        spectrumUrl:
          spectrumHandle &&
          getSpectrumUrl(spectrumHandle) + (spectrumPath || `/${repo}`),
        typescriptApiBox,
        versions: versionKeys, // only need to send version labels to client
        defaultVersion,
        baseUrl
      }
    });
  });
};
