const {colors} = require('gatsby-theme-apollo-core/src/utils/colors');

module.exports = ({
  root,
  siteName,
  subtitle,
  description,
  githubRepo,
  versions = {},
  segmentApiKey,
  checkLinksOptions,
  twitterHandle
}) => {
  const gatsbyRemarkPlugins = [
    'gatsby-remark-autolink-headers',
    {
      resolve: 'gatsby-remark-copy-linked-files',
      options: {
        ignoreFileExtensions: []
      }
    },
    {
      resolve: 'gatsby-remark-mermaid',
      options: {
        mermaidOptions: {
          themeCSS: `
            .node rect,
            .node circle {
              stroke-width: 2px;
              stroke: ${colors.primary};
              fill: ${colors.background};
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.tertiary rect,
            .node.tertiary circle {
              fill: white;
            }
            .node.secondary rect,
            .node.secondary circle {
              stroke: ${colors.secondary};
            }
            .node.tertiary rect,
            .node.tertiary circle {
              stroke: ${colors.tertiaryLight};
            }
          `
        }
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

  const plugins = [
    {
      resolve: 'gatsby-theme-apollo-core',
      options: {
        root
      }
    },
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
    'gatsby-plugin-printer',
    ...Object.entries(versions).map(([name, branch]) => ({
      resolve: 'gatsby-source-git',
      options: {
        name,
        branch,
        remote: `https://github.com/${githubRepo}`,
        patterns: [
          'docs/source/**',
          'docs/gatsby-config.js',
          'docs/_config.yml'
        ]
      }
    }))
  ];

  if (segmentApiKey) {
    plugins.push({
      resolve: 'gatsby-plugin-segment-js',
      options: {
        prodKey: segmentApiKey,
        trackPage: true
      }
    });
  }

  return {
    siteMetadata: {
      title: 'Apollo GraphQL Docs',
      siteName,
      subtitle,
      description,
      twitterHandle
    },
    plugins
  };
};
