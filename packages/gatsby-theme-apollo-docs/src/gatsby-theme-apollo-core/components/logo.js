import React from 'react';
import styled from '@emotion/styled';
import {ApolloIcon} from '@apollo/space-kit/icons/ApolloIcon';
import {ReactComponent as Docs} from '../../assets/docs.svg';

const Wrapper = styled.div({
  display: 'flex'
});

const StyledApolloIcon = styled(ApolloIcon)({
  width: 64,
  height: 'auto'
});

const StyledDocs = styled(Docs)({
  marginLeft: 6,
  marginTop: 1,
  height: 16
});

export default function Logo() {
  return (
    <Wrapper>
      <StyledApolloIcon />
      <StyledDocs />
    </Wrapper>
  );
}
