const jsYaml = require('js-yaml');
const path = require('path');
const git = require('simple-git')();
const {createFilePath} = require('gatsby-source-filesystem');
const {getVersionBasePath} = require('./src/utils');
const {default: getShareImage} = require('@jlengstorf/get-share-image');

function getConfigPaths(baseDir) {
  return [
    path.join(baseDir, 'gatsby-config.js'), // new gatsby config
    path.join(baseDir, '_config.yml') // old hexo config
  ];
}

async function onCreateNode(
  {node, actions, getNode, loadNodeContent},
  {
    baseDir = '',
    contentDir = 'content',
    defaultVersion = 'default',
    localVersion,
    siteName,
    subtitle,
    sidebarCategories,
    shareImageConfig
  }
) {
  const configPaths = getConfigPaths(baseDir);
  if (configPaths.includes(node.relativePath)) {
    const value = await loadNodeContent(node);
    actions.createNodeField({
      name: 'raw',
      node,
      value
    });
  }

  if (['MarkdownRemark', 'Mdx'].includes(node.internal.type)) {
    const parent = getNode(node.parent);
    let version = localVersion || defaultVersion;
    let slug = createFilePath({
      node,
      getNode
    });

    if (node.frontmatter.slug) {
      slug = node.frontmatter.slug; // eslint-disable-line prefer-destructuring
    }

    const {title, sidebar_title, api_reference} = node.frontmatter;

    let tagline = subtitle || siteName;
    for (const key in sidebarCategories) {
      if (key !== 'null') {
        const categories = sidebarCategories[key];
        const trimmedSlug = slug.replace(/^\/|\/$/g, '');
        if (categories.includes(trimmedSlug)) {
          tagline += ` › ${key}`;
          break;
        }
      }
    }

    let versionRef = '';
    if (parent.gitRemote___NODE) {
      const gitRemote = getNode(parent.gitRemote___NODE);
      version = gitRemote.sourceInstanceName;
      versionRef = gitRemote.ref;

      const dirPattern = new RegExp(path.join('^', baseDir, contentDir));
      slug = slug.replace(dirPattern, '');
    }

    if (version !== defaultVersion) {
      slug = getVersionBasePath(version) + slug;
    }

    actions.createNodeField({
      name: 'image',
      node,
      value: shareImageConfig
        ? getShareImage({
            title,
            tagline,
            ...shareImageConfig
          })
        : ''
    });

    actions.createNodeField({
      node,
      name: 'version',
      value: version
    });

    actions.createNodeField({
      node,
      name: 'versionRef',
      value: versionRef
    });

    actions.createNodeField({
      node,
      name: 'slug',
      value: slug
    });

    actions.createNodeField({
      node,
      name: 'sidebarTitle',
      value: sidebar_title || ''
    });

    actions.createNodeField({
      node,
      name: 'apiReference',
      value: Boolean(api_reference)
    });
  }
}

exports.onCreateNode = onCreateNode;

function getPageFromEdge({node}) {
  return node.childMarkdownRemark || node.childMdx;
}

function getSidebarContents(sidebarCategories, edges, version, dirPattern) {
  return Object.keys(sidebarCategories).map(key => ({
    title: key === 'null' ? null : key,
    pages: sidebarCategories[key]
      .map(linkPath => {
        const match = linkPath.match(/^\[(.+)\]\((https?:\/\/.+)\)$/);
        if (match) {
          return {
            anchor: true,
            title: match[1],
            path: match[2]
          };
        }

        const edge = edges.find(edge => {
          const {relativePath} = edge.node;
          const {fields} = getPageFromEdge(edge);
          return (
            fields.version === version &&
            relativePath
              .slice(0, relativePath.lastIndexOf('.'))
              .replace(dirPattern, '') === linkPath
          );
        });

        if (!edge) {
          return null;
        }

        const {frontmatter, fields} = getPageFromEdge(edge);
        return {
          title: frontmatter.title,
          sidebarTitle: fields.sidebarTitle,
          description: frontmatter.description,
          path: fields.slug
        };
      })
      .filter(Boolean)
  }));
}

function getVersionSidebarCategories(gatsbyConfig, hexoConfig) {
  if (gatsbyConfig) {
    const trimmed = gatsbyConfig.slice(
      gatsbyConfig.indexOf('sidebarCategories')
    );

    const json = trimmed
      .slice(0, trimmed.indexOf('}'))
      // wrap object keys in double quotes
      .replace(/^\s*['"]?(\w[\w\s&-]+)['"]?:/gm, '"$1":')
      // replace single-quoted array values with double quoted ones
      .replace(/'(.*?)'/g, '"$1"')
      // remove trailing commas
      .trim()
      .replace(/,\s*\]/g, ']')
      .replace(/,\s*$/, '');

    const {sidebarCategories} = JSON.parse(`{${json}}}`);
    return sidebarCategories;
  }

  const {sidebar_categories} = jsYaml.load(hexoConfig);
  return sidebar_categories;
}

const pageFragment = `
  internal {
    type
  }
  frontmatter {
    title
    description
  }
  fields {
    slug
    version
    versionRef
    sidebarTitle
  }
`;

exports.createPages = async (
  {actions, graphql},
  {
    baseDir = '',
    contentDir = 'content',
    defaultVersion = 'default',
    versions = {},
    subtitle,
    githubRepo,
    githubHost = 'github.com',
    sidebarCategories,
    ffWidgetId,
    footerNavConfig,
    twitterHandle,
    localVersion,
    baseUrl
  }
) => {
  const {data} = await graphql(`
    {
      allFile(filter: {extension: {in: ["md", "mdx"]}}) {
        edges {
          node {
            id
            relativePath
            childMarkdownRemark {
              ${pageFragment}
            }
            childMdx {
              ${pageFragment}
            }
          }
        }
      }
    }
  `);

  const {edges} = data.allFile;
  const mainVersion = localVersion || defaultVersion;
  const contentPath = path.join(baseDir, contentDir);
  const dirPattern = new RegExp(`^${contentPath}/`);

  const sidebarContents = {
    [mainVersion]: getSidebarContents(
      sidebarCategories,
      edges,
      mainVersion,
      dirPattern
    )
  };

  const configPaths = getConfigPaths(baseDir);
  const versionKeys = [localVersion].filter(Boolean);
  for (const version in versions) {
    if (version !== defaultVersion) {
      versionKeys.push(version);
    }

    // grab the old config files for each older version
    const configs = await Promise.all(
      configPaths.map(async configPath => {
        const response = await graphql(`
          {
            file(
              relativePath: {eq: "${configPath}"}
              gitRemote: {sourceInstanceName: {eq: "${version}"}}
            ) {
              fields {
                raw
              }
            }
          }
        `);

        const {file} = response.data;
        return file && file.fields.raw;
      })
    );

    sidebarContents[version] = getSidebarContents(
      getVersionSidebarCategories(...configs),
      edges,
      version,
      dirPattern
    );
  }

  let defaultVersionNumber = null;
  try {
    defaultVersionNumber = parseFloat(defaultVersion, 10);
  } catch (error) {
    // let it slide
  }

  // get the current git branch
  // try to use the BRANCH env var from Netlify
  // fall back to using git rev-parse if BRANCH is not available
  const currentBranch =
    process.env.BRANCH || (await git.revparse(['--abbrev-ref', 'HEAD']));

  const template = require.resolve('./src/components/template');
  edges.forEach(edge => {
    const {id, relativePath} = edge.node;
    const {fields} = getPageFromEdge(edge);

    let versionDifference = 0;
    if (defaultVersionNumber) {
      try {
        const versionNumber = parseFloat(fields.version, 10);
        versionDifference = versionNumber - defaultVersionNumber;
      } catch (error) {
        // do nothing
      }
    }

    let githubUrl;

    if (githubRepo) {
      const [owner, repo] = githubRepo.split('/');
      githubUrl =
        'https://' +
        path.join(
          githubHost,
          owner,
          repo,
          'tree',
          fields.versionRef || path.join(currentBranch, contentPath),
          relativePath
        );
    }

    actions.createPage({
      path: fields.slug,
      component: template,
      context: {
        id,
        subtitle,
        versionDifference,
        versionBasePath: getVersionBasePath(fields.version),
        sidebarContents: sidebarContents[fields.version],
        githubUrl,
        forumUrl:
          footerNavConfig &&
          footerNavConfig.Forums &&
          footerNavConfig.Forums.href,
        ffWidgetId,
        twitterHandle,
        versions: versionKeys, // only need to send version labels to client
        defaultVersion,
        baseUrl
      }
    });
  });
};
