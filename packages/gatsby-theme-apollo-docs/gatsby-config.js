const path = require('path');
const remarkTypescript = require('remark-typescript');
const {colors} = require('gatsby-theme-apollo-core/src/utils/colors');
const {HEADER_HEIGHT} = require('./src/utils');
const cheerio = require('cheerio');
const {
  getMdxHeadings,
  algoliaSettings,
  MetricsFetcher,
  METRICS
} = require('apollo-algolia-transform');

function getMdHeadings(tableOfContents) {
  const $ = cheerio.load(tableOfContents);

  return $('a')
    .get()
    .reduce((acc, aTag) => {
      const el = $(aTag);
      const depth = el.parents('ul').length + 1;
      const href = el.attr('href');
      const hashIndex = href.indexOf('#');

      const heading = {
        url: href.slice(hashIndex),
        title: el.text()
      };

      const key = 'h' + depth;
      const existing = acc[key];

      return {
        ...acc,
        [key]: existing ? [...existing, heading] : [heading]
      };
    }, {});
}

async function parse({data, baseUrl, viewId}) {
  let allGAData = {};
  if (process.env.NODE_ENV !== 'test') {
    const metricsFetcher = new MetricsFetcher({viewId});
    allGAData = await metricsFetcher.fetchAll();
  }

  const {site, allMarkdownRemark, allMdx} = data;
  const allPages = allMarkdownRemark.nodes.concat(allMdx.nodes);
  return allPages.flatMap(page => {
    const {id, fields, frontmatter, excerpt, tableOfContents, mdxAST} = page;
    const {slug, sidebarTitle, isCurrentVersion} = fields;
    const {title} = frontmatter;

    const url = baseUrl + site.pathPrefix + slug;
    const docset = site.pathPrefix.replace(/^\/docs\//, '');

    const categories = ['documentation', sidebarTitle.toLowerCase()];
    if (['react', 'ios', 'android'].includes(docset)) {
      categories.push('client');
    }

    // TODO: split page into sections by heading
    return [
      {
        objectID: id,
        index: 0, // TODO: make dynamic
        type: 'docs',
        url,
        docset,
        title,
        excerpt,
        categories,
        isCurrentVersion,
        headings: mdxAST
          ? getMdxHeadings(tableOfContents.items)
          : getMdHeadings(tableOfContents),
        pageviews: allGAData[url]?.[METRICS.uniquePageViews] || 0
        // TODO: needs text, probably other properties
      }
    ];
  });
}

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
  algoliaAppId,
  algoliaWriteKey,
  algoliaIndexName,
  gaViewId
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
    {
      resolve: 'gatsby-remark-mermaid',
      options: {
        mermaidOptions: {
          themeCSS: `
            .node rect,
            .node circle,
            .node polygon,
            .node path {
              stroke-width: 2px;
              stroke: ${colors.primary};
              fill: ${colors.background};
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.secondary polygon,
            .node.tertiary rect,
            .node.tertiary circle,
            .node.tertiary polygon {
              fill: white;
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.secondary polygon {
              stroke: ${colors.secondary};
            }
            .cluster rect,
            .node.tertiary rect,
            .node.tertiary circle,
            .node.tertiary polygon {
              stroke: ${colors.tertiary};
            }
            .cluster rect {
              fill: none;
              stroke-width: 2px;
            }
            .label, .edgeLabel {
              background-color: white;
              line-height: 1.3;
            }
            .edgeLabel rect {
              background: none;
              fill: none;
            }
            .messageText, .noteText, .loopText {
              font-size: 12px;
              stroke: none;
            }
            g rect, polygon.labelBox {
              stroke-width: 2px;
            }
            g rect.actor {
              stroke: ${colors.tertiary};
              fill: white;
            }
            g rect.note {
              stroke: ${colors.secondary};
              fill: white;
            }
            g line.loopLine, polygon.labelBox {
              stroke: ${colors.primary};
              fill: white;
            }
          `
        }
      }
    },
    'gatsby-remark-code-titles',
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
    },
    ...gatsbyRemarkPlugins
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

  if (algoliaAppId && algoliaWriteKey && algoliaIndexName && gaViewId) {
    plugins.push({
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: algoliaAppId,
        apiKey: algoliaWriteKey,
        // only index when building for production on Netlify
        skipIndexing: process.env.CONTEXT !== 'production',
        queries: [
          {
            query: `
              {
                site {
                  pathPrefix
                }
                allMarkdownRemark {
                  nodes {
                    id
                    htmlAst
                    excerpt(pruneLength: 100)
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
                    id
                    mdxAST
                    excerpt(pruneLength: 100)
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
            `,
            transformer: ({data}) =>
              parse({
                data,
                baseUrl,
                viewId: gaViewId
              }),
            indexName: algoliaIndexName,
            settings: algoliaSettings.default
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
      description
    },
    plugins
  };
};
