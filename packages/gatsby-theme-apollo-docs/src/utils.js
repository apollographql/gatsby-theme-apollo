const {createContext} = require('react');

/* global ga */
function trackEvent(options) {
  if (typeof ga === 'function') {
    ga('send', 'event', options);
  }
}

function getVersionBasePath(version) {
  return `/v${version.replace(/\s+/g, '-')}`;
}

function getSpectrumUrl(handle) {
  return `https://spectrum.chat/${handle}`;
}

function createWithBaseDir(baseDir) {
  return path => (baseDir ? [baseDir, path].join('/') : path);
}

exports.MainRefContext = createContext();
exports.trackEvent = trackEvent;
exports.getVersionBasePath = getVersionBasePath;
exports.getSpectrumUrl = getSpectrumUrl;
exports.createWithBaseDir = createWithBaseDir;

exports.GA_EVENT_CATEGORY_CODE_BLOCK = 'Code Block';
exports.GA_EVENT_CATEGORY_SIDEBAR = 'Sidebar';

exports.CONFIG_PATHS = [
  'gatsby-config.js', // new gatsby config
  '_config.yml' // old hexo config
];
