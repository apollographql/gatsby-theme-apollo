module.exports = {
  siteMetadata: {
    title: 'Apollo Documentation'
  },
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-plugin-typography',
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
