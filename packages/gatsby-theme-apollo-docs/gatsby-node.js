const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');

exports.onCreateNode = ({node, actions, getNode}) => {
  if (['MarkdownRemark', 'Mdx'].includes(node.internal.type)) {
    actions.createNodeField({
      name: 'slug',
      node,
      value: createFilePath({node, getNode})
    });
  }
};

function getPageFromEdge({node}) {
  return node.childMarkdownRemark || node.childMdx;
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
    contentDir,
    githubRepo,
    sidebarCategories,
    spectrumPath,
    docs
  } = options;
  const sidebarContents = Object.keys(sidebarCategories).map(key => ({
    title: key === 'null' ? null : key,
    pages: sidebarCategories[key]
      .map(path => {
        const edge = data.allFile.edges.find(edge => {
          const {relativePath} = edge.node;
          return relativePath.slice(0, relativePath.lastIndexOf('.')) === path;
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

  const template = require.resolve('./src/components/template');
  data.allFile.edges.forEach(edge => {
    const page = getPageFromEdge(edge);
    actions.createPage({
      path: page.fields.slug,
      component: template,
      context: {
        id: edge.node.id,
        filePath: path.join(contentDir, edge.node.relativePath),
        sidebarContents,
        githubRepo,
        spectrumPath,
        docs
      }
    });
  });
};
