const withThemePath = require('./with-theme-path');

exports.createPages = ({actions, graphql}) => {
  const {createPage} = actions;
  const template = withThemePath('./src/templates/docs.js');
  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: template,
        context: {}, // additional data can be passed via context
      })
    })
  })
}