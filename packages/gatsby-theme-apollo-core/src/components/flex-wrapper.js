import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  maxWidth: 1440,
  margin: '0 auto'
});

const InnerWrapper = styled.div({
  display: 'flex',
  flexGrow: 1
});

export default function FlexWrapper({children, beforeContent, ...props}) {
  return (
    <Wrapper {...props}>
      {beforeContent}
      <InnerWrapper>{children}</InnerWrapper>
    </Wrapper>
  );
}

FlexWrapper.propTypes = {
  beforeContent: PropTypes.node,
  children: PropTypes.node.isRequired
};
