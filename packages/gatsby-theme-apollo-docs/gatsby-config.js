module.exports = ({
  subtitle,
  description,
  root,
  githubRepo,
  versions = {},
  checkLinksExceptions
}) => {
  const remarkPlugins = [
    'gatsby-remark-autolink-headers',
    {
      resolve: 'gatsby-remark-copy-linked-files',
      options: {
        ignoreFileExtensions: []
      }
    },
    {
      resolve: 'gatsby-remark-prismjs',
      options: {
        showLineNumbers: true
      }
    },
    {
      resolve: 'gatsby-remark-check-links',
      options: {
        exceptions: checkLinksExceptions
      }
    }
  ];

  return {
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
          plugins: remarkPlugins
        }
      },
      {
        resolve: 'gatsby-plugin-google-analytics',
        options: {
          trackingId: 'UA-74643563-13'
        }
      },
      {
        resolve: 'gatsby-plugin-mdx',
        options: {
          gatsbyRemarkPlugins: [
            {
              resolve: 'gatsby-remark-typescript',
              options: {
                wrapper: 'MultiCodeBlock'
              }
            },
            ...remarkPlugins
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
