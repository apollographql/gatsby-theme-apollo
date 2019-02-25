const path = require('path');

// include theme files in babel transpilation
exports.onCreateWebpackConfig = ({loaders, actions}) => {
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
};
