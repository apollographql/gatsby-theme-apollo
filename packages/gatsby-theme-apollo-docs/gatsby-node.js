const jsYaml = require('js-yaml');
const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');
const {getVersionBasePath} = require('./src/utils');

async function onCreateNode({node, actions, getNode, loadNodeContent}) {
  if (node.relativePath === 'docs/_config.yml') {
    const value = await loadNodeContent(node);
    actions.createNodeField({
      name: 'raw',
      node,
      value
    });
  }

  if (node.internal.type === 'Mdx') {
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

function getSidebarContents(sidebarCategories, edges, version) {
  return Object.keys(sidebarCategories).map(key => ({
    title: key === 'null' ? null : key,
    pages: sidebarCategories[key]
      .map(linkPath => {
        const match = linkPath.match(
          /^\[([\w\s\d]+)\]\((https?:\/\/[\w.]+)\)$/
        );
        if (match) {
          return {
            anchor: true,
            title: match[1],
            path: match[2]
          };
        }

        const edge = edges.find(edge => {
          const {fields, parent} = edge.node;
          return (
            fields.version === version &&
            parent.relativePath
              .slice(0, parent.relativePath.lastIndexOf('.'))
              .replace(/^docs\/source\//, '') === linkPath
          );
        });

        if (!edge) {
          return null;
        }

        const {frontmatter, fields} = edge.node;
        return {
          title: frontmatter.title,
          path: fields.slug
        };
      })
      .filter(Boolean)
  }));
}

exports.createPages = async ({actions, graphql}, options) => {
  const {data} = await graphql(`
    {
      allMdx {
        edges {
          node {
            id
            parent {
              ... on File {
                relativePath
              }
            }
            frontmatter {
              title
            }
            fields {
              slug
              version
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
    defaultVersion
  } = options;

  const {edges} = data.allMdx;
  const sidebarContents = {
    default: getSidebarContents(sidebarCategories, edges, 'default')
  };

  const versionKeys = [];
  for (const version in versions) {
    versionKeys.push(version);

    // grab the old YAML config file for each older version
    const response = await graphql(`
      {
        allFile(
          filter: {
            relativePath: {eq: "docs/_config.yml"}
            gitRemote: {sourceInstanceName: {eq: "${version}"}}
          }
        ) {
          edges {
            node {
              fields {
                raw
              }
            }
          }
        }
      }
    `);

    const [{node}] = response.data.allFile.edges;
    const {sidebar_categories} = jsYaml.load(node.fields.raw);
    sidebarContents[version] = getSidebarContents(
      sidebar_categories,
      edges,
      version
    );
  }

  const [owner, repo] = githubRepo.split('/');
  const template = require.resolve('./src/components/template');
  edges.forEach(edge => {
    const {id, fields, parent} = edge.node;
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
            parent.relativePath
          ),
        spectrumPath: spectrumPath || repo,
        typescriptApiBox,
        versions: versionKeys, // only need to send version labels to client
        defaultVersion
      }
    });
  });
};
