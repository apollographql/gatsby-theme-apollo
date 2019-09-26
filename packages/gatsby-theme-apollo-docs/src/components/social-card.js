import PropTypes from 'prop-types';
import React from 'react';
import TextFit from 'react-textfit';
import {ApolloIcon} from '@apollo/space-kit/icons/ApolloIcon';
import {colors} from 'gatsby-theme-apollo-core/src/utils/colors';

const borderWidth = 6;
const borderOffset = borderWidth * 2;

export default function SocialCard(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        width: 1200 - borderOffset,
        height: 675 - borderOffset,
        padding: 80,
        border: `${borderWidth}px solid ${colors.primary}`
      }}
    >
      <div
        style={{
          fontSize: 50,
          marginBottom: 20
        }}
      >
        {props.subtitle}
      </div>
      <TextFit
        min={80}
        max={140}
        style={{
          width: '100%',
          height: 250,
          marginBottom: 'auto'
        }}
      >
        {props.title}
      </TextFit>
      <ApolloIcon
        height={80}
        style={{
          color: colors.primary
        }}
      />
    </div>
  );
}

SocialCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
};
