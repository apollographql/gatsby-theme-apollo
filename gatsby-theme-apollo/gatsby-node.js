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
