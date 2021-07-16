const {
  getMdxHeadings,
  MetricsFetcher,
  METRICS
} = require('apollo-algolia-transform');
const cheerio = require('cheerio');

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

export async function parse({data, baseUrl, viewId}) {
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
