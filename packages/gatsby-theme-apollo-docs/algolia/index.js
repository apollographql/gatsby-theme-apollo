const {
  getMdxHeadings,
  MetricsFetcher,
  METRICS
} = require('apollo-algolia-transform');
const cheerio = require('cheerio');
const {truncate} = require('lodash');

// recursively get text from all nested children to form a single string of text
const getChildrenText = children =>
  Array.isArray(children)
    ? children
        .map(child =>
          ['text', 'inlineCode'].includes(child.type)
            ? child.value
            : getChildrenText(child.children)
        )
        .join(' ')
    : '';

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
    // TODO: for auto-generated mobile docs, not all have frontmatter -- can either use the h1 or the last URL path before /index.html
    const {title} = frontmatter;

    const url = baseUrl + site.pathPrefix + slug;
    const docset = site.pathPrefix.replace(/^\/docs\//, '');

    const categories = ['documentation', sidebarTitle.toLowerCase()];
    if (['react', 'ios', 'android'].includes(docset)) {
      categories.push('client');
    }

    const sections = mdxAST
      ? mdxAST.children.reduce(
          (acc, child) => {
            if (child.type === 'heading') {
              let ancestors = [];
              for (const section of acc) {
                if (section.depth < child.depth) {
                  ancestors = [section, ...section.ancestors];
                  break;
                }
              }

              // look at acc[acc.length - 1].ancestors
              return [
                {
                  title: getChildrenText(child.children), // get text children from heading
                  // TODO: get heading slug
                  children: [],
                  depth: child.depth,
                  ancestors
                },
                ...acc
              ];
            }

            acc[0].children.push(child);
            return acc;
          },
          [{children: []}]
        )
      : [];

    // console.log(sections);
    const arr = sections.reverse().map((section, index) => {
      const text = getChildrenText(section.children)
        .replace(/\n/g, ' ') // replace all new lines with space
        .replace(/\s+/g, ' '); // replace all multi-spaces with a single space
      return {
        objectID: id,
        index,
        type: 'docs',
        url,
        docset,
        title,
        excerpt: truncate(text, {length: 100, separator: ' '}),
        text,
        categories,
        isCurrentVersion,
        sectionHeading: section.title,
        headings: mdxAST // TODO: rework headings to use section ancestors
          ? getMdxHeadings(tableOfContents.items)
          : getMdHeadings(tableOfContents),
        pageviews: allGAData[url]?.[METRICS.uniquePageViews] || 0,
        ancestors: section.ancestors
      };
    });
    console.log(arr);
    return arr;
  });
}

module.exports = {parse};
