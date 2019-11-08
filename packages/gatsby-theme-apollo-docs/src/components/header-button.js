import React from 'react';
import styled from '@emotion/styled';
import {Button} from '@apollo/space-kit/Button';
import {IconSchema} from '@apollo/space-kit/icons/IconSchema';
import {breakpoints, colors} from 'gatsby-theme-apollo-core';

const StyledButton = styled(Button)({
  marginLeft: 16,
  [breakpoints.sm]: {
    display: 'none !important'
  }
});

const StyledIcon = styled(IconSchema)({
  height: '100%'
});

export default function HeaderButton() {
  return (
    <StyledButton
      as={
        <a
          href="https://engine.apollographql.com"
          target="_blank"
          rel="noopener noreferrer"
        />
      }
      icon={<StyledIcon />}
      color={colors.primary}
      feel="flat"
    >
      Go to Graph Manager
    </StyledButton>
  );
}
