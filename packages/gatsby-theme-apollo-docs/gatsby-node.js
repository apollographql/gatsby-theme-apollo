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

function getPageFromFile({node}) {
  return node.childMarkdownRemark || node.childMdx;
}

exports.createPages = async ({actions, graphql}, options) => {
  const {data} = await graphql(`
    {
      allFile {
        edges {
          node {
            childMarkdownRemark {
              id
              internal {
                type
              }
              fields {
                slug
              }
            }
            childMdx {
              id
              internal {
                type
              }
              fields {
                slug
              }
            }
          }
        }
      }
    }
  `);

  const sidebarContents = Object.keys(options.sidebarCategories).map(key => ({
    title: key === 'null' ? null : key,
    pages: options.sidebarCategories[key].map(path => ({
      title: 'text',
      path
    }))
  }));

  data.allFile.edges.filter(getPageFromFile).forEach(file => {
    const page = getPageFromFile(file);
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
