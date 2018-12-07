import React from 'react';
import Search from './search';
import styled from '@emotion/styled';
import {ReactComponent as Logo} from '../../../assets/logo.svg';

const Container = styled.header({
  display: 'flex',
  alignItems: 'center',
  padding: 16,
  color: 'white',
  backgroundColor: 'blue'
});

const StyledLogo = styled(Logo)({
  marginRight: 'auto',
  height: 40,
  fill: 'currentColor'
});

export default function Header() {
  return (
    <Container>
      <StyledLogo />
      <Search />
    </Container>
  );
}
