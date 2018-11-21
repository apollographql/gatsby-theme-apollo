const withThemePath = require('./with-theme-path');

exports.createPages = ({actions}) => {
  const {createPage} = actions;
  createPage({
    path: '/',
    component: withThemePath('./src/templates/docs.js')
  })
}