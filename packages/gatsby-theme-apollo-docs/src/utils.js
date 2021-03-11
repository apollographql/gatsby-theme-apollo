function getVersionBasePath(version) {
  return `/v${version.replace(/\s+/g, '-')}`;
}

function getSpectrumUrl(handle) {
  return `https://spectrum.chat/${handle}`;
}

function trackCustomEvent({category, action, label, value}) {
  if (window.gtag) {
    window.gtag('event', action, {
      category,
      label,
      value
    });
  }
}

exports.getSpectrumUrl = getSpectrumUrl;
exports.getVersionBasePath = getVersionBasePath;
exports.HEADER_HEIGHT = 72;
exports.trackCustomEvent = trackCustomEvent;
