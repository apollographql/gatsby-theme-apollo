import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div({
  position: 'relative',
  overflow: 'hidden',
  paddingTop: 'calc(100% / (16 / 9))'
});

const Iframe = styled.iframe({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 0
});

export function VideoFrame({src, title}) {
  return (
    <Wrapper>
      <Iframe
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Wrapper>
  );
}

VideoFrame.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string
};
