const gatsbyRemarkPlugins = [
  'gatsby-remark-copy-linked-files',
  'gatsby-remark-autolink-headers',
  {
    resolve: 'gatsby-remark-prismjs',
    options: {
      showLineNumbers: true
    }
  }
];

module.exports = ({subtitle, description, pathPrefix, root}) => ({
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-apollo',
      options: {
        root
      }
    }
  ],
  pathPrefix,
  siteMetadata: {
    title: 'Apollo Docs',
    subtitle,
    description
  },
  plugins: [
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
    },
    {
      resolve: 'gatsby-mdx',
      options: {
        gatsbyRemarkPlugins
      }
    }
  ]
});
