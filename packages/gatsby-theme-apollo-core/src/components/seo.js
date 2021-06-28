import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

export default function SEO({
  title,
  description,
  siteName,
  twitterCard = 'summary',
  children,
  favicon = [
    'https://www.apollographql.com/favicon.ico',
    'https://odyssey.apollographql.com/favicon.svg'
  ]
}) {
  const favicons = Array.isArray(favicon) ? favicon : [favicon];
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {favicons.map((icon, index) => (
        <link key={index} rel="icon" href={icon} />
      ))}
      {children}
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  twitterCard: PropTypes.string,
  children: PropTypes.node,
  favicon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
};
