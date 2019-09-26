import PropTypes from 'prop-types';
import React from 'react';

export default function SocialCard(props) {
  return (
    <div>
      <h1>{props.frontmatter.title}</h1>
    </div>
  );
}

SocialCard.propTypes = {
  frontmatter: PropTypes.object.isRequired
};
