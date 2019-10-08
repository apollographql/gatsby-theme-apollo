/* global preval */
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TextFit from 'react-textfit';
import {ApolloIcon} from '@apollo/space-kit/icons/ApolloIcon';
import {Global, css} from '@emotion/core';
import {IconArrowRight} from '@apollo/space-kit/icons/IconArrowRight';
import {colors} from 'gatsby-theme-apollo-core/src/utils/colors';
import {smallCaps} from 'gatsby-theme-apollo-core/src/utils/typography';

const stuff = preval`
  const fs = require('fs')
  const path = require('path')
  const fontDir = path.dirname(
    require.resolve('source-sans-pro/source-sans-pro.css')
  )

  const base64Regular = fs.readFileSync(
    fontDir + '/WOFF2/TTF/SourceSansPro-Regular.ttf.woff2',
    'base64'
  )

  const base64Semibold = fs.readFileSync(
    fontDir + '/WOFF2/TTF/SourceSansPro-Semibold.ttf.woff2',
    'base64'
  )

  const fonts = fs
    .readFileSync(
      path.join(fontDir, '/source-sans-pro.css'),
      "utf-8"
    )
    .replace(
      'WOFF2/TTF/SourceSansPro-Regular.ttf.woff2',
      'data:application/x-font-woff;charset=utf-8;base64,' + base64Regular
    )
    .replace(
      'WOFF2/TTF/SourceSansPro-Semibold.ttf.woff2',
      'data:application/x-font-woff;charset=utf-8;base64,' + base64Semibold
    )

  module.exports = {
    fonts
  }
`;

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
        height: 628 - borderOffset,
        padding: 80,
        border: `${borderWidth}px solid ${colors.primary}`,
        fontFamily: "'Source Sans Pro'"
      }}
    >
      <Global
        styles={css`
          ${stuff.fonts}
          svg.arrow-icon * {
            vector-effect: none;
          }
        `}
      />
      <div
        style={{
          fontSize: 48,
          fontWeight: 600,
          marginBottom: 16,
          color: colors.text2,
          ...smallCaps,
          letterSpacing: '0.142em'
        }}
      >
        {props.subtitle}
        {props.category && (
          <Fragment>
            {' '}
            <IconArrowRight
              className="arrow-icon"
              style={{
                width: '1em',
                height: '1em',
                verticalAlign: '-0.15em'
              }}
            />{' '}
            {props.category}
          </Fragment>
        )}
      </div>
      <TextFit
        min={80}
        max={140}
        style={{
          width: '100%',
          height: 250,
          marginBottom: 'auto',
          colors: colors.text1
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
  subtitle: PropTypes.string.isRequired,
  category: PropTypes.string
};
