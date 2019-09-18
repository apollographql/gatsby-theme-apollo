const {createContext} = require('react');

/* global ga */
function trackEvent(options) {
  if (typeof ga === 'function') {
    ga('send', 'event', options);
  }
}

function getVersionBasePath(version) {
  return `/v${version}`;
}

function getSpectrumUrl(handle) {
  return `https://spectrum.chat/${handle}`;
}

exports.MainRefContext = createContext();
exports.trackEvent = trackEvent;
exports.getSpectrumUrl = getSpectrumUrl;
exports.getVersionBasePath = getVersionBasePath;
exports.GA_EVENT_CATEGORY_CODE_BLOCK = 'Code Block';
exports.GA_EVENT_CATEGORY_SIDEBAR = 'Sidebar';
