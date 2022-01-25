import React from 'react';
import styled from '@emotion/styled';
import {ApolloIcon} from '@apollo/space-kit/icons/ApolloIcon';
import {ReactComponent as DocsIcon} from '../../assets/docs.svg';

const Wrapper = styled.div({
  display: 'flex',
  fontSize: 24
});

const StyledApolloIcon = styled(ApolloIcon)({
  marginRight: '0.2857142857em'
});

const StyledDocsIcon = styled(DocsIcon)({
  height: '0.7857142857em',
  marginTop: '0.07142857143em'
});

export default function Logo() {
  return (
    <Wrapper>
      {/* having the height in `StyledApolloIcon` gets overridden by a 293px from emotion */}
      <StyledApolloIcon style={{height: '1em'}} />
      <StyledDocsIcon />
    </Wrapper>
  );
}
