const {
  MetricsFetcher,
  METRICS,
  createRecords,
  getMdxHeading,
  getChildrenText
} = require('apollo-algolia-transform');

function getMdHeading(child) {
  if (child.type === 'element') {
    // test that this element is a heading (h1, h2, etc.) and save the digit
    const match = child.tagName.match(/^h(\d)$/);
    if (match) {
      return {
        title: getChildrenText(child),
        hash: '#' + child.properties.id,
        depth: Number(match[1]) // use the saved digit as the depth property
      };
    }
  }
}

async function transformer({data}) {
  const {site, allMarkdownRemark, allMdx} = data;
  const {siteUrl, gaViewId} = site.siteMetadata;

  let allGAData = {};
  if (process.env.NODE_ENV !== 'test') {
    const metricsFetcher = new MetricsFetcher({viewId: gaViewId});
    allGAData = await metricsFetcher.fetchAll();
  }

  const allPages = allMarkdownRemark.nodes.concat(allMdx.nodes);
  const records = allPages.flatMap(page => {
    const {id, fields, frontmatter, tableOfContents, htmlAst, mdxAST} = page;
    const {slug, sidebarTitle, isCurrentVersion} = fields;

    // TODO: for auto-generated mobile docs, not all have frontmatter -- can either use the h1 or the last URL path before /index.html
    const {title} = frontmatter;

    const url = siteUrl + slug;
    const docset = site.pathPrefix.replace(/^\/docs\//, '');

    const categories = ['documentation'];

    if (sidebarTitle) {
      categories.push(sidebarTitle.toLowerCase());
    }

    if (['react', 'ios', 'android'].includes(docset)) {
      categories.push('client');
    }

    return createRecords({
      children: (mdxAST || htmlAst).children,
      url,
      id,
      getHeading: mdxAST ? getMdxHeading : getMdHeading,
      tableOfContents,
      otherProperties: {
        title,
        type: 'docs',
        docset,
        slug,
        isCurrentVersion,
        pageviews: allGAData[url]?.[METRICS.uniquePageViews] || 0,
        categories
      }
    });
  });

  console.log('Created %s Algolia records', records.length);

  return records;
}

module.exports = {transformer};
