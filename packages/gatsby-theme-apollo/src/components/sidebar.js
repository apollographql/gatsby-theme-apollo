import Header from './header';
import LogoTitle from './logo-title';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import colors from '../util/colors';
import styled from '@emotion/styled';
import {breakpointMd} from '../util/breakpoints';

const Container = styled.aside({
  flexShrink: 0,
  width: 305,
  borderRight: `1px solid ${colors.divider}`,
  overflowY: 'auto',
  position: 'relative',
  [breakpointMd]: {
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateX(-100%)',
    transitionProperty: 'transform, opacity, visibility',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out'
  }
});

const StyledHeader = styled(Header)({
  borderBottom: `1px solid ${colors.divider}`,
  fontSize: 18
});

const Content = styled.div({
  padding: '20px 24px',
  paddingRight: 0
});

export default class Sidebar extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired
  };

  render() {
    return (
      <Container
        style={
          this.props.open
            ? {
                opacity: 1,
                visibility: 'visible',
                transform: 'none'
              }
            : null
        }
      >
        <StyledHeader>
          <LogoTitle />
        </StyledHeader>
        <Content>{this.props.children}</Content>
      </Container>
    );
  }
}
