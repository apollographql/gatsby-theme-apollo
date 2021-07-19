const {MetricsFetcher, METRICS} = require('apollo-algolia-transform');
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
        .join('')
    : '';

function headingsReducer(acc, {items = [], url, title}) {
  const existing = acc[title];
  return items.reduce(headingsReducer, {
    ...acc,
    [title]: existing ? [...existing, url] : [url]
  });
}

function getMdxHeading(child, headings) {
  if (child.type === 'heading') {
    // get text children from heading
    const title = getChildrenText(child.children);

    // splice the first result for that title in the headings object
    // this lets us account for multiple headings with the same title
    // but different URLs in the same page
    const [hash] = headings[title].splice(0, 1);

    return {
      title,
      hash,
      depth: child.depth
    };
  }
}

function getMdHeading(child) {
  if (child.type === 'element') {
    // test that this element is a heading (h1, h2, etc.) and save the digit
    const match = child.tagName.match(/^h(\d)$/);
    if (match) {
      return {
        title: getChildrenText(child.children),
        hash: '#' + child.properties.id,
        depth: Number(match[1]) // use the saved digit as the depth property
      };
    }
  }
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
    const {id, fields, frontmatter, tableOfContents, htmlAst, mdxAST} = page;
    const {slug, sidebarTitle, isCurrentVersion} = fields;
    // TODO: for auto-generated mobile docs, not all have frontmatter -- can either use the h1 or the last URL path before /index.html
    const {title} = frontmatter;

    const url = baseUrl + site.pathPrefix + slug;
    const docset = site.pathPrefix.replace(/^\/docs\//, '');

    const categories = ['documentation', sidebarTitle.toLowerCase()];
    if (['react', 'ios', 'android'].includes(docset)) {
      categories.push('client');
    }

    // create a mapping of heading title -> url for MDX pages
    const mdxHeadings = tableOfContents.items?.reduce(headingsReducer, {});

    const sections = (mdxAST || htmlAst).children.reduce(
      (acc, child) => {
        // these will return a heading object if the child is a heading
        const heading = mdxAST
          ? getMdxHeading(child, mdxHeadings)
          : getMdHeading(child);

        if (heading) {
          // determine the heading's ancestors by looping through existing
          // sections and comparing their depth with the current heading's
          let ancestors = [];
          for (const section of acc) {
            if (section.depth < heading.depth) {
              ancestors = [section.title, ...section.ancestors];
              break;
            }
          }

          return [
            {
              ...heading,
              children: [],
              ancestors
            },
            ...acc
          ];
        }

        // if the child is not a heading, add it to the section as a child
        acc[0].children.push(child);
        return acc;
      },
      [{children: []}]
    );

    const arr = sections.reverse().map((section, index) => {
      const {title: sectionTitle, hash, children, ancestors = []} = section;
      // replace all whitespace with a single space
      const text = getChildrenText(children).replace(/\s+/g, ' ');
      return {
        objectID: `${id}_${index}`,
        index,
        type: 'docs',
        url: hash ? url + hash : url,
        docset,
        title,
        sectionTitle,
        text,
        excerpt: truncate(text, {length: 100, separator: ' '}),
        ancestors,
        categories,
        isCurrentVersion,
        pageviews: allGAData[url]?.[METRICS.uniquePageViews] || 0
      };
    });
    console.log(arr);
    return arr;
  });
}

module.exports = {parse};
