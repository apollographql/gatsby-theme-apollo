const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Themes work!'
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.resolve('./docs'),
        name: 'markdown-pages'
      }
    },
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-mdx',
      options: {
        defaultLayouts: {
          default: require.resolve('./src/templates/docs.js')
        }
      }
    }
  ]
};