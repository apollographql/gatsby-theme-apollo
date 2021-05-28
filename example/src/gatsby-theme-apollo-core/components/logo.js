import React from 'react';
import styled from '@emotion/styled';

const StyledImage = styled.img({
  height: 24
});

export default function Logo() {
  return (
    <StyledImage
      alt="Hello world"
      src="https://upload.wikimedia.org/wikipedia/commons/2/28/HelloWorld.svg"
    />
  );
}
