import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh'
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
