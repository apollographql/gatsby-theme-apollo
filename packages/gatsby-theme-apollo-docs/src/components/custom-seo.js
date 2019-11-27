import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {withPrefix} from 'gatsby';

export default function CustomSEO(props) {
  const imagePath = withPrefix('/' + props.image);
  return (
    <Fragment>
      <meta property="og:image" content={imagePath} />
      <meta name="twitter:image" content={props.baseUrl + imagePath} />
      {props.twitterHandle && (
        <meta name="twitter:site" content={`@${props.twitterHandle}`} />
      )}
    </Fragment>
  );
}

CustomSEO.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  twitterHandle: PropTypes.string
};
