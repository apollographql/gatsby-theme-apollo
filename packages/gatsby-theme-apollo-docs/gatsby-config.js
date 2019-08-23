module.exports = ({
  root,
  siteName,
  subtitle,
  description,
  githubRepo,
  versions = {},
  trackingId,
  checkLinksOptions
}) => {
  const gatsbyRemarkPlugins = [
    'gatsby-remark-autolink-headers',
    {
      resolve: 'gatsby-remark-copy-linked-files',
      options: {
        ignoreFileExtensions: []
      }
    },
    'gatsby-remark-prismjs-title',
    {
      resolve: 'gatsby-remark-prismjs',
      options: {
        showLineNumbers: true
      }
    },
    'gatsby-remark-rewrite-relative-links',
    {
      resolve: 'gatsby-remark-check-links',
      options: checkLinksOptions
    }
  ];

  return {
    __experimentalThemes: [
      {
        resolve: 'gatsby-theme-apollo-core',
        options: {
          root
        }
      }
    ],
    siteMetadata: {
      title: siteName,
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
          trackingId
        }
      },
      {
        resolve: 'gatsby-plugin-mdx',
        options: {
          gatsbyRemarkPlugins: [
            {
              resolve: 'gatsby-remark-typescript',
              options: {
                wrapperComponent: 'MultiCodeBlock'
              }
            },
            ...gatsbyRemarkPlugins
          ]
        }
      },
      ...Object.keys(versions).map(key => ({
        resolve: 'gatsby-source-git',
        options: {
          name: key,
          remote: `https://github.com/${githubRepo}`,
          branch: versions[key],
          patterns: 'docs/**'
        }
      }))
    ]
  };
};
