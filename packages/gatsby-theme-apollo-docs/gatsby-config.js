const gatsbyRemarkPlugins = ['gatsby-remark-copy-linked-files'];

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
    {
      resolve: 'gatsby-mdx',
      options: {
        gatsbyRemarkPlugins
      }
    },
    'gatsby-plugin-less',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${root}/source`,
        name: 'docs'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: gatsbyRemarkPlugins
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-74643563-13'
      }
    }
  ]
});
