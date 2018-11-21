const path = require('path');

const withThemePath = relativePath => {
  let pathResolvedPath = path.resolve(relativePath)
  let finalPath = pathResolvedPath

  try {
    // check if the user's site has the file
    require.resolve(pathResolvedPath)
  } catch (e) {
    // if the user hasn't implemented the file,
    finalPath = require.resolve(relativePath)
  }

  return finalPath
}

module.exports = withThemePath;
