module.exports = ({subtitle, description, basePath}) => ({
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-apollo'
    }
  ],
  siteMetadata: {
    title: 'Apollo Docs',
    subtitle,
    description,
    basePath
  }
});
