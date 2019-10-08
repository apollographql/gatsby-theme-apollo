import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';

export default function SEO(props) {
  const {title, description, siteName, twitterHandle, baseUrl} = props;
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={'/' + props.image} />
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && (
        <meta name="twitter:site" content={`@${twitterHandle}`} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}/${props.image}`} />
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  twitterHandle: PropTypes.string,
  baseUrl: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
};
