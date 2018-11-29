const path = require('path');
const slug = require('remark-slug');

module.exports = {
  siteMetadata: {
    title: 'Apollo Documentation'
  },
  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-emotion',
    'gatsby-plugin-typography',
    {
      resolve: 'gatsby-mdx',
      options: {
        mdPlugins: [slug],
        defaultLayouts: {
          default: require.resolve('./src/templates/docs.js')
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: path.resolve('./src/pages/')
      }
    }
  ]
};
