const dotenv = require('dotenv');
const path = require('path');
const slug = require('remark-slug');

dotenv.config();

module.exports = {
  siteMetadata: {
    title: 'Apollo Documentation'
  },
  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-emotion',
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
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: path.relative(
          process.cwd(),
          require.resolve('./src/util/typography.js')
        )
      }
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'GitHub',
        fieldName: 'github',
        url: 'https://api.github.com/graphql',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        }
      }
    }
  ]
};
