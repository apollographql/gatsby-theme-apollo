module.exports = ({subtitle, description, basePath, root}) => ({
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-apollo',
      options: {
        root
      }
    }
  ],
  pathPrefix: basePath,
  siteMetadata: {
    title: 'Apollo Docs',
    subtitle,
    description,
    basePath
  }
});
