const fs = require('fs');
const path = require('path');

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
