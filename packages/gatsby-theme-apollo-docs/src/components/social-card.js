import PropTypes from 'prop-types';
import React from 'react';
import TextFit from 'react-textfit';

export default function SocialCard(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 1200,
        height: 675,
        padding: 100
      }}
    >
      <h5 style={{marginBottom: 'auto'}}>Apollo Docs</h5>
      <TextFit style={{height: 250}}>{props.frontmatter.title}</TextFit>
      {/* <h3>{props.frontmatter.description}</h3> */}
    </div>
  );
}

SocialCard.propTypes = {
  frontmatter: PropTypes.object.isRequired
};
