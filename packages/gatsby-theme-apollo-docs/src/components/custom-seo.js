import PropTypes from 'prop-types';
import React from 'react';
import {SEO} from 'gatsby-theme-apollo-core';

export default function CustomSEO({image, twitterHandle, canonical, ...props}) {
  return (
    <SEO {...props} twitterCard={image ? 'summary_large_image' : 'summary'}>
      {image && <meta property="og:image" content={image} />}
      {twitterHandle && (
        <meta name="twitter:site" content={`@${twitterHandle}`} />
      )}
      <link rel="canonical" href={canonical} />
    </SEO>
  );
}

CustomSEO.propTypes = {
  image: PropTypes.string,
  canonical: PropTypes.string.isRequired,
  twitterHandle: PropTypes.string
};
