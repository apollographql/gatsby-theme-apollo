const {createFilePath} = require('gatsby-source-filesystem');
const kebabCase = require('lodash/kebabCase');

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
  id
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

  const sidebarContents = Object.keys(options.sidebarCategories).map(key => ({
    title: key === 'null' ? null : key,
    pages: options.sidebarCategories[key]
      .map(path => {
        const edge = data.allFile.edges.find(edge => {
          const {relativePath} = edge.node;
          return relativePath.slice(0, relativePath.lastIndexOf('.')) === path;
        });

        if (!edge) {
          return null;
        }

        const page = getPageFromEdge(edge);
        return {
          title: page.frontmatter.title,
          path: page.fields.slug
        };
      })
      .filter(Boolean)
  }));

  data.allFile.edges.map(getPageFromEdge).forEach(page => {
    actions.createPage({
      path: page.fields.slug,
      component: require.resolve(
        `./src/templates/${kebabCase(page.internal.type)}`
      ),
      context: {
        id: page.id,
        sidebarContents
      }
    });
  });
};
