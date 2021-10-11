const path = require('path');
const remarkTypescript = require('remark-typescript');
const {HEADER_HEIGHT} = require('./src/utils');
const {transformer} = require('./algolia');
const {algoliaSettings} = require('apollo-algolia-transform');

module.exports = ({
  root,
  baseUrl,
  pathPrefix,
  siteName,
  pageTitle,
  description,
  githubHost = 'github.com',
  githubRepo,
  baseDir = '',
  contentDir = 'content',
  versions = {},
  gaTrackingId,
  gtmContainerId,
  ignore,
  checkLinksOptions,
  gatsbyRemarkPlugins = [],
  remarkPlugins = [],
  oneTrust,
  algoliaAppId,
  algoliaWriteKey,
  algoliaIndexName
}) => {
  const allGatsbyRemarkPlugins = [
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
    'gatsby-remark-rewrite-relative-links',
    {
      resolve: 'gatsby-remark-check-links',
      options: checkLinksOptions
    },
    ...gatsbyRemarkPlugins,
    'gatsby-remark-code-titles',
    {
      resolve: 'gatsby-remark-prismjs',
      options: {
        showLineNumbers: true
      }
    }
  ];

  const plugins = [
    'gatsby-theme-apollo-core',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(root, contentDir),
        name: 'docs',
        ignore
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: allGatsbyRemarkPlugins
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: allGatsbyRemarkPlugins,
        remarkPlugins: [
          [remarkTypescript, {wrapperComponent: 'MultiCodeBlock'}],
          ...remarkPlugins
        ]
      }
    },
    ...Object.entries(versions).map(([name, branch]) => ({
      resolve: 'gatsby-source-git',
      options: {
        name,
        branch,
        remote: `https://${githubHost}/${githubRepo}`,
        patterns: [
          path.join(baseDir, contentDir, '**'),
          path.join(baseDir, 'gatsby-config.js'),
          path.join(baseDir, '_config.yml')
        ]
      }
    }))
  ];

  if (gaTrackingId) {
    plugins.push({
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: Array.isArray(gaTrackingId) ? gaTrackingId : [gaTrackingId]
      }
    });
  }

  if (gtmContainerId) {
    plugins.push({
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: gtmContainerId
      }
    });
  }

  if (oneTrust) {
    plugins.push({
      resolve: 'gatsby-plugin-apollo-onetrust',
      options: {
        autoBlockSrc: process.env.OT_AUTOBLOCK_SRC,
        otSDKStubSrc: process.env.OT_SDKSTUB_SRC,
        dataDomainScript: process.env.OT_DATA_DOMAIN_SCRIPT
      }
    });
  }

  if (algoliaAppId && algoliaWriteKey && algoliaIndexName) {
    plugins.push({
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: algoliaAppId,
        apiKey: algoliaWriteKey,
        // only index when building for production on Netlify
        skipIndexing:
          !['production', 'branch-deploy'].includes(process.env.CONTEXT) &&
          process.env.SKIP_INDEXING !== 'false',
        queries: [
          {
            query: `
              query AlgoliaQuery {
                site {
                  siteMetadata {
                    siteUrl
                  }
                }
                sitePlugin(name: {eq: "gatsby-theme-apollo-docs"}) {
                  pluginOptions {
                    gaViewId
                    docset: algoliaIndexName
                  }
                }
                allMarkdownRemark {
                  nodes {
                    ...NodeFragment
                    htmlAst
                    tableOfContents
                    frontmatter {
                      title
                      description
                    }
                    fields {
                      slug
                      isCurrentVersion
                      apiReference
                      sidebarTitle
                    }
                  }
                }
                allMdx {
                  nodes {
                    ...NodeFragment
                    mdxAST
                    tableOfContents
                    frontmatter {
                      title
                      description
                    }
                    fields {
                      slug
                      isCurrentVersion
                      apiReference
                      sidebarTitle
                    }
                  }
                }
              }

              fragment NodeFragment on Node {
                id
                parent {
                  ... on File {
                    name
                  }
                }
              }
            `,
            transformer,
            indexName: algoliaIndexName,
            settings: {
              ...algoliaSettings,
              attributesForFaceting: ['categories', 'docset', 'type'],
              // put docs for current version at top, then by page views and index
              customRanking: [
                'desc(isCurrentVersion)',
                ...algoliaSettings.customRanking
              ]
            }
          }
        ]
      }
    });
  }

  return {
    pathPrefix,
    siteMetadata: {
      title: pageTitle || siteName,
      siteName,
      description,
      siteUrl: baseUrl + pathPrefix
    },
    plugins
  };
};
