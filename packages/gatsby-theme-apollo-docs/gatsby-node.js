const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');
const kebabCase = require('lodash/kebabCase');

exports.onCreateNode = ({node, actions, getNode}) => {
  if (['Mdx', 'MarkdownRemark'].includes(node.internal.type)) {
    actions.createNodeField({
      name: 'slug',
      node,
      value: createFilePath({node, getNode})
    });
  }
};

exports.createPages = async ({actions, graphql}, options) => {
  const {data} = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            fields {
              slug
            }
            internal {
              type
            }
            fileAbsolutePath
            html
          }
        }
      }
      allMdx {
        edges {
          node {
            id
            fields {
              slug
            }
            internal {
              type
            }
            fileAbsolutePath
            code {
              body
              scope
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

  const pages = data.allMdx.edges.concat(data.allMarkdownRemark.edges);
  pages.forEach(({node}) => {
    const template = kebabCase(node.internal.type);
    actions.createPage({
      path: node.fields.slug,
      component: require.resolve(`./src/templates/${template}`),
      context: {
        id: node.id,
        sidebarContents
      }
    });
  });
};
