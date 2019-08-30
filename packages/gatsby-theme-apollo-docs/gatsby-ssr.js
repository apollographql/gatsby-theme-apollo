import PageLayout from './src/components/page-layout';
import React from 'react';

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
  {algoliaApiKey, algoliaIndexName}
) => (
  <PageLayout
    {...props}
    algoliaApiKey={algoliaApiKey}
    algoliaIndexName={algoliaIndexName}
  >
    {element}
  </PageLayout>
);
