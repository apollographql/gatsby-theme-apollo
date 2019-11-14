const {createContext} = require('react');

function getVersionBasePath(version) {
  return `/v${version.replace(/\s+/g, '-')}`;
}

function getSpectrumUrl(handle) {
  return `https://spectrum.chat/${handle}`;
}

exports.MainRefContext = createContext();
exports.getSpectrumUrl = getSpectrumUrl;
exports.getVersionBasePath = getVersionBasePath;
