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
  },
  plugins: [
    'gatsby-plugin-less',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-74643563-13'
      }
    }
  ]
});
