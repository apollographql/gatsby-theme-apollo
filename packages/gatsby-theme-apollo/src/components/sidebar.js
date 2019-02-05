import Header from './header';
import PropTypes from 'prop-types';
import React from 'react';
import colors from '../util/colors';
import styled from '@emotion/styled';
import {ReactComponent as LogoSmall} from '../../ui/logo-small.svg';

const Container = styled.aside({
  flexShrink: 0,
  width: 305,
  borderRight: `1px solid ${colors.divider}`,
  overflowY: 'auto',
  position: 'relative'
});

const StyledHeader = styled(Header)({
  borderBottom: `1px solid ${colors.divider}`,
  fontSize: 18
});

const StyledLogoSmall = styled(LogoSmall)({
  marginRight: 8,
  height: 36,
  fill: 'currentColor'
});

const Content = styled.div({
  padding: '20px 24px',
  paddingRight: 0
});

export default function Sidebar(props) {
  return (
    <Container>
      <StyledHeader>
        <StyledLogoSmall />
        {props.title}
      </StyledHeader>
      <Content>{props.children}</Content>
    </Container>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};
