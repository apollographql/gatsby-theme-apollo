import React from 'react';
import styled from '@emotion/styled';
import {Button} from '@apollo/space-kit/Button';
import {IconProceed} from '@apollo/space-kit/icons/IconProceed';
import {breakpoints, colors} from 'gatsby-theme-apollo-core';

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

const StyledIcon = styled(IconProceed)({
  height: '0.75em',
  marginLeft: '0.5em'
});

export default function HeaderButton() {
  return (
    <Container>
      <Button
        as={
          <a
            href="https://engine.apollographql.com"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        color={colors.primary}
        feel="flat"
        style={{fontWeight: 400}}
      >
        Launch Graph Manager
        <StyledIcon weight="thin" />
      </Button>
    </Container>
  );
}
