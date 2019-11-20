import React from 'react';
import styled from '@emotion/styled';
import {IconProceed} from '@apollo/space-kit/icons/IconProceed';
import {breakpoints} from 'gatsby-theme-apollo-core';
import {colors} from '@apollo/space-kit/colors';

const Container = styled.div({
  width: 240,
  marginLeft: -12,
  marginRight: 44,
  flexShrink: 0,
  [breakpoints.lg]: {
    width: 'auto',
    marginRight: 0
  },
  [breakpoints.md]: {
    display: 'none'
  }
});

const StyledLink = styled.a({
  color: colors.indigo.dark,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  padding: '0 12px',
  textDecoration: 'none',
  ':hover': {
    color: colors.indigo.darker
  }
});

const StyledIcon = styled(IconProceed)({
  height: '0.75em',
  marginLeft: '0.5em'
});

export default function HeaderButton() {
  return (
    <Container>
      <StyledLink
        href="https://engine.apollographql.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Launch Graph Manager
        <StyledIcon weight="thin" />
      </StyledLink>
    </Container>
  );
}
