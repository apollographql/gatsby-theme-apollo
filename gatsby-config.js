const path = require('path');

module.exports = ({subtitle, description, basePath}) => ({
  siteMetadata: {
    title: 'Apollo Documentation',
    subtitle,
    description,
    basePath
  },
  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: path.relative(
          process.cwd(),
          require.resolve('./src/util/typography.js')
        )
      }
    }
  ]
});
