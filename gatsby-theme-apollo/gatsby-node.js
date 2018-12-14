const fs = require('fs');
// const path = require('path');
const axios = require('axios');
const origin = require('git-remote-origin-url');

// exports.onCreateWebpackConfig = ({actions, loaders}) =>
//   actions.setWebpackConfig({
//     module: {
//       rules: [
//         {
//           test: /\.js$/,
//           include: path.dirname(require.resolve('gatsby-theme-apollo')),
//           use: [loaders.js()]
//         }
//       ]
//     }
//   });

// copy the theme favicon to the built site
exports.onPostBootstrap = ({store}) => {
  const {program} = store.getState();
  const source = `${__dirname}/static/favicon.ico`;
  const destination = `${program.directory}/public/favicon.ico`;
  fs.copyFileSync(source, destination);
};

exports.createPages = async ({graphql, actions}) => {
  const tags = [];
  const url = await origin();
  const match = url.match(/\/([\w-]+)\/([\w-]+)\.git$/);
  const owner = match[1];
  const repo = 'apollo-server'; // match[2];

  let cursor = null;
  let hasNextPage = true;
  while (hasNextPage) {
    const result = await graphql(`
      {
        github {
          repository(owner: "${owner}", name: "${repo}") {
            name
            refs(
              after: ${cursor}
              first: 100
              refPrefix: "refs/tags/"
              orderBy: {field: TAG_COMMIT_DATE, direction: DESC}
            ) {
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes {
                id
                name
              }
            }
          }
        }
      }
    `);

    const {pageInfo, nodes} = result.data.github.repository.refs;
    cursor = JSON.stringify(pageInfo.endCursor);
    hasNextPage = pageInfo.hasNextPage;
    tags.push(
      ...nodes.filter(
        node => /^v\d/.test(node.name) || node.name.indexOf(repo + '@') === 0
      )
    );
  }

  const api = axios.create({
    baseURL: `https://api.github.com/repos/${owner}/${repo}/contents`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  });

  const response = await api.get('/docs/source', {
    params: {
      ref: tags[0].name
    }
  });

  const contents = await Promise.all(
    response.data
      .filter(content => content.type === 'file')
      .map(async file => {
        const {data} = await api.get(file.path);
        return {
          ...data,
          buffer: Buffer.from(data.content, data.encoding)
        };
      })
  );

  actions.createPage({
    path: '/tags',
    component: require.resolve('./src/templates/docs'),
    context: {
      tags,
      contents,
      title: 'tags'
    }
  });
};
