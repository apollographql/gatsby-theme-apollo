const mapKeys = require('lodash/mapKeys');
const {colors} = require('./src/utils/colors');
const {fontFamilyMono} = require('./src/utils/typography');

const colorVars = mapKeys(colors, (value, key) => `color-${key}`);

module.exports = {
  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-less',
      options: {
        modifyVars: {
          ...colorVars,
          'font-family-mono': fontFamilyMono
        }
      }
    }
  ]
};
