const path = require('path');
const remarkTypescript = require('remark-typescript');
const {colors} = require('gatsby-theme-apollo-core/src/utils/colors');
const {HEADER_HEIGHT} = require('./src/utils');

module.exports = ({
  root,
  siteName,
  subtitle,
  pageTitle,
  description,
  githubRepo,
  baseDir = '',
  contentDir = 'source',
  versions = {},
  segmentApiKey,
  checkLinksOptions,
  twitterHandle
}) => {
  const gatsbyRemarkPlugins = [
    {
      resolve: 'gatsby-remark-autolink-headers',
      options: {
        offsetY: HEADER_HEIGHT
      }
    },
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
    'gatsby-theme-apollo-core',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(root, contentDir),
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
        gatsbyRemarkPlugins,
        remarkPlugins: [
          [remarkTypescript, {wrapperComponent: 'MultiCodeBlock'}]
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
          path.join(baseDir, contentDir, '**'),
          path.join(baseDir, 'gatsby-config.js'),
          path.join(baseDir, '_config.yml')
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
      title: pageTitle || siteName,
      siteName,
      subtitle,
      description,
      twitterHandle
    },
    plugins
  };
};
