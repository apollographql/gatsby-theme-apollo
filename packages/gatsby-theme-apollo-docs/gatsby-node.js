const path = require('path');
const simpleGit = require('simple-git/promise');
const matter = require('gray-matter');
const yaml = require('js-yaml');
const fs = require('fs');
const util = require('util');

function treeToObjects(tree) {
  return tree.split('\n').map(object => ({
    mode: object.slice(0, object.indexOf(' ')),
    path: object.slice(object.lastIndexOf('\t') + 1)
  }));
}

const configPaths = ['gatsby-config.js', '_config.yml'];
async function getSidebarCategories(git, ref) {
  // check for config paths in our current set of objects
  const tree = await git.raw(['ls-tree', '-r', ref]);
  const objects = treeToObjects(tree);
  const filePaths = objects.map(object => object.path);
  const existingConfig = configPaths.filter(configPath =>
    filePaths.includes(configPath)
  )[0];

  if (existingConfig) {
    const existingConfigText = await git.show([`${ref}:./${existingConfig}`]);
    if (/\.yml$/.test(existingConfig)) {
      // parse the config if it's YAML
      const yamlConfig = yaml.safeLoad(existingConfigText);
      return yamlConfig.sidebar_categories;
    }

    // TODO: handle js configs
  }

  return null;
}

function getOwnerRepo(githubRepo) {
  const [owner, repo] = githubRepo.split('/');
  return {
    owner,
    repo
  };
}

async function getContents(contentDir, basePath, categories, getText) {
  const contents = [];
  for (const category in categories) {
    const sidebarItems = categories[category];
    const categoryContents = await Promise.all(
      sidebarItems.map(async sidebarItem => {
        if (typeof sidebarItem !== 'string') {
          // sidebar items can be an object with `title` and `href`
          // properties to render a regular anchor tag
          return {
            path: sidebarItem.href,
            title: sidebarItem.title,
            anchor: true
          };
        }

        const filePath = `${contentDir}/${sidebarItem}.md`;
        const text = await getText(filePath);
        if (!text) {
          return null;
        }

        const {content, data} = matter(text);
        return {
          ...data,
          content,
          path: basePath + sidebarItem.replace(/^index$/, ''),
          filePath
        };
      })
    );

    contents.push({
      title: category === 'null' ? null : category,
      pages: categoryContents.filter(Boolean)
    });
  }

  return contents;
}

function boolToNumber(bool) {
  return Number(Boolean(bool));
}

async function getVersions({
  root,
  contentDir,
  githubRepo,
  sidebarCategories,
  versions
}) {
  const git = simpleGit(root);
  const remotes = await git.getRemotes();
  const hasOrigin = remotes.some(remote => remote.name === 'origin');
  if (!hasOrigin) {
    await git.addRemote('origin', `https://github.com/${githubRepo}.git`);
  }

  // update repo
  await git.fetch();
  const {owner, repo} = getOwnerRepo(githubRepo);
  const sortedVersions = versions
    ? versions.sort((a, b) => boolToNumber(b.default) - boolToNumber(a.default))
    : ['HEAD'];
  return Promise.all(
    sortedVersions.map(async version => {
      try {
        const remoteRef =
          version.ref === 'HEAD' ? version.ref : `origin/${version.ref}`;
        const tree = await git.raw(['ls-tree', '-r', '--full-tree', remoteRef]);
        if (!tree) {
          return null;
        }

        // use the provided `sidebarCategories` from Gatsby config for the
        // current (latest) version, or grab the appropriate config file for
        // the version at hand
        const versionSidebarCategories = version.default
          ? sidebarCategories
          : await getSidebarCategories(git, remoteRef);

        if (!versionSidebarCategories) {
          throw new Error(`No sidebar configuration found at ${version.ref}`);
        }

        // organize some arrays describing the repo contents that will be
        // useful later
        const objects = treeToObjects(tree);
        const markdown = objects.filter(({path}) => /\.mdx?$/.test(path));
        const markdownPaths = markdown.map(object => object.path);
        const docs = markdown.filter(({path}) => !path.indexOf(contentDir));
        const basePath = version.default ? '/' : `/v${version.value}/`;
        const contents = await getContents(
          contentDir,
          basePath,
          versionSidebarCategories,
          async filePath => {
            const doc = docs.find(({path}) => path === filePath);
            if (!doc) {
              throw new Error(`Doc not found: ${filePath}@${version.ref}`);
            }

            const text = await git.show([`${remoteRef}:${filePath}`]);
            if (doc.mode !== '120000') {
              // if the file is NOT a symlink we return it
              return text;
            }

            // ...otherwise we need to follow the symlink
            const directory = doc.path.slice(0, doc.path.lastIndexOf('/'));
            const symlink = path.resolve(`/${directory}`, text).slice(1);

            // ensure that the symlinked page exists because errors thrown
            // by `git.show` below cause subsequent git functions to fail
            if (!markdownPaths.includes(symlink)) {
              return null;
            }

            return git.show([`${remoteRef}:${symlink}`]);
          }
        );

        return {
          id: version.value,
          basePath,
          contents,
          owner,
          repo,
          ref: version.ref
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    })
  );
}

const readFile = util.promisify(fs.readFile);
async function getLocalVersions(
  graphql,
  {root, contentDir, githubRepo, sidebarCategories}
) {
  const result = await graphql(`
    {
      allMarkdown: allFile(filter: {extension: {eq: "md"}}) {
        edges {
          node {
            absolutePath
          }
        }
      }
      allImages: allFile(
        filter: {extension: {in: ["jpg", "jpeg", "png", "gif", "svg"]}}
      ) {
        edges {
          node {
            relativePath
            publicURL
          }
        }
      }
    }
  `);

  const basePath = '/';
  const contents = await getContents(
    contentDir,
    basePath,
    sidebarCategories,
    filePath => {
      const page = result.data.allMarkdown.edges.find(
        ({node}) =>
          filePath === path.relative(path.dirname(root), node.absolutePath)
      );

      return page && readFile(page.node.absolutePath, 'utf8');
    }
  );

  return [
    {
      id: 'dev',
      basePath,
      contents,
      localImages: result.data.allImages.edges
        .map(edge => edge.node)
        .reduce(
          (acc, {relativePath, publicURL}) => ({
            ...acc,
            [relativePath]: publicURL
          }),
          {}
        ),
      ...getOwnerRepo(githubRepo),
      ref: 'HEAD'
    }
  ];
}

const template = require.resolve('./src/components/template');
exports.createPages = async ({actions, graphql}, options) => {
  const versions =
    process.env.NODE_ENV === 'development'
      ? await getLocalVersions(graphql, options)
      : await getVersions(options);
  versions.filter(Boolean).forEach((version, index, array) => {
    version.contents.forEach(({pages}) => {
      pages.forEach(({path, filePath, title, description, content, anchor}) => {
        if (anchor) {
          // don't create pages for sidebar links
          return;
        }

        actions.createPage({
          path,
          component: template,
          context: {
            content,
            title,
            description,
            version,
            filePath,
            docs: options.docs,
            typescriptApiBox: options.typescriptApiBox,
            // use `array` here instead of `versions` because we're filtering
            // before the loop starts
            versions: array
          }
        });
      });
    });
  });
};
