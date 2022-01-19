const mapKeys = require('lodash/mapKeys');
const {colors} = require('./src/utils/colors');

module.exports = {
  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-less',
      options: {
        lessOptions: {
          modifyVars: mapKeys(colors, (value, key) => `color-${key}`)
        }
      }
    }
  ]
};
