const fs = require('fs');
const path = require('path');
const origin = require('git-remote-origin-url');

exports.onCreateWebpackConfig = ({actions, loaders}) =>
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.dirname(require.resolve('gatsby-theme-apollo')),
          use: [loaders.js()]
        }
      ]
    }
  });

// copy the theme favicon to the built site
exports.onPostBootstrap = ({store}) => {
  const {program} = store.getState();
  const source = `${__dirname}/static/favicon.ico`;
  const destination = `${program.directory}/public/favicon.ico`;
  fs.copyFileSync(source, destination);
};

exports.createPages = async ({graphql}) => {
  const url = await origin();
  const match = url.match(/\/([\w-]+)\/([\w-]+)\.git$/);
  const owner = match[1];
  const name = 'apollo-server'; // match[2];
  const result = await graphql(`
      {
        github {
          repository(owner: "${owner}", name: "${name}") {
            name
            refs(
              first: 100
              refPrefix: "refs/tags/"
              orderBy: {field: TAG_COMMIT_DATE, direction: DESC}
            ) {
              nodes {
                name
              }
            }
          }
        }
      }
    `);

  result.data.github.repository.refs.nodes
    .filter(
      node => /^v\d/.test(node.name) || node.name.indexOf(name + '@') === 0
    )
    .forEach(node => console.log(node.name));
};
