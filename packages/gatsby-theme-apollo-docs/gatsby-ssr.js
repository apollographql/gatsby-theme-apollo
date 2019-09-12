import PageLayout from './src/components/page-layout';
import React from 'react';
import {getSpectrumUrl} from './src/utils';

export const onRenderBody = ({setPostBodyComponents}) => {
  setPostBodyComponents([
    React.createElement('script', {
      key: 'docsearch',
      src:
        'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js'
    })
  ]);
};

export const wrapPageElement = (
  {element, props}, // eslint-disable-line react/prop-types
  pluginOptions
) => (
  <PageLayout
    {...props}
    navConfig={pluginOptions.navConfig}
    footerNavConfig={pluginOptions.footerNavConfig}
    algoliaApiKey={pluginOptions.algoliaApiKey}
    algoliaIndexName={pluginOptions.algoliaIndexName}
    spectrumUrl={
      pluginOptions.spectrumHandle &&
      getSpectrumUrl(pluginOptions.spectrumHandle)
    }
    twitterUrl={
      pluginOptions.twitterHandle &&
      `https://twitter.com/${pluginOptions.twitterHandle}`
    }
    youtubeUrl={pluginOptions.youtubeUrl}
    logoLink={pluginOptions.logoLink}
  >
    {element}
  </PageLayout>
);
