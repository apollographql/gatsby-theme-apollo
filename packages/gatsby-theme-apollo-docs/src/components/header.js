import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {breakpoints} from 'gatsby-theme-apollo-core';

export const HEADER_HEIGHT = 64;
const Wrapper = styled.header({
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 1
});

const InnerWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: HEADER_HEIGHT,
  padding: '0 56px',
  backgroundColor: 'white',
  [breakpoints.md]: {
    padding: '0 24px'
  }
});

export default function Header(props) {
  return (
    <Wrapper>
      {props.beforeContent}
      <InnerWrapper>{props.children}</InnerWrapper>
    </Wrapper>
  );
}

Header.propTypes = {
  beforeContent: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};
