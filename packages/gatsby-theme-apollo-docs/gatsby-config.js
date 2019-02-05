module.exports = ({subtitle, description, basePath, root}) => ({
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-apollo',
      options: {
        root
      }
    }
  ],
  siteMetadata: {
    title: 'Apollo Docs',
    subtitle,
    description,
    basePath
  }
});
