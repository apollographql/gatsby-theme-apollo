import React from 'react';
import styled from '@emotion/styled';
import {Button} from '@apollo/space-kit/Button';
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
      >
        Go to Graph Manager
      </Button>
    </Container>
  );
}
