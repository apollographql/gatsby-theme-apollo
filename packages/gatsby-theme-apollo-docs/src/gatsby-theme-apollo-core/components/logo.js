import React from 'react';
import styled from '@emotion/styled';
import {ApolloIcon} from '@apollo/space-kit/icons/ApolloIcon';
import {ReactComponent as Docs} from '../../assets/docs.svg';

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  fontSize: 20
});

const StyledApolloIcon = styled(ApolloIcon)({
  height: '1em'
});

const StyledDocs = styled(Docs)({
  marginLeft: '0.3em',
  transform: 'translateY(-0.025em)'
});

export default function Logo() {
  return (
    <Wrapper>
      <StyledApolloIcon />
      <StyledDocs height="0.8em" />
    </Wrapper>
  );
}
