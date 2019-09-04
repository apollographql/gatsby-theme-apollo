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
  {algoliaApiKey, algoliaIndexName, baseUrl, navConfig}
) => (
  <PageLayout
    {...props}
    baseUrl={baseUrl}
    navItems={Object.entries(navConfig).map(([path, navItem]) => ({
      ...navItem,
      path
    }))}
    algoliaApiKey={algoliaApiKey}
    algoliaIndexName={algoliaIndexName}
  >
    {element}
  </PageLayout>
);
