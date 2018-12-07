import React from 'react';
import styled from '@emotion/styled';
import {ReactComponent as Logo} from '../../assets/logo.svg';

const Container = styled.header({
  padding: 16,
  color: 'white',
  backgroundColor: 'blue'
});

const StyledLogo = styled(Logo)({
  display: 'block',
  height: 40,
  fill: 'currentColor'
});

export default function Header() {
  return (
    <Container>
      <StyledLogo />
    </Container>
  );
}
