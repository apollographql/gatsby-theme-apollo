import Header from './header';
import LogoTitle from './logo-title';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import breakpoints from '../util/breakpoints';
import colors from '../util/colors';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {transparentize} from 'polished';

const Container = styled.aside(
  {
    flexShrink: 0,
    width: 305,
    borderRight: `1px solid ${colors.divider}`,
    overflowY: 'auto',
    position: 'relative'
  },
  props =>
    props.responsive && {
      [breakpoints.md]: {
        height: '100%',
        backgroundColor: 'white',
        boxShadow: `0 0 48px ${transparentize(0.75, 'black')}`,
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
    }
);

const StyledHeader = styled(Header)({
  borderBottom: `1px solid ${colors.divider}`,
  fontSize: 18
});

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none'
});

const Content = styled.div({
  padding: '20px 24px',
  paddingRight: 0
});

export default class Sidebar extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool,
    noLogo: PropTypes.bool,
    responsive: PropTypes.bool
  };

  render() {
    return (
      <Container
        responsive={this.props.responsive}
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
          <StyledLink to="/">
            <LogoTitle noLogo={this.props.noLogo} />
          </StyledLink>
        </StyledHeader>
        <Content>{this.props.children}</Content>
      </Container>
    );
  }
}
