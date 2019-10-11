import Header from './header';
import LogoTitle from './logo-title';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import breakpoints from '../utils/breakpoints';
import styled from '@emotion/styled';
import {colors} from '../utils/colors';
import {transparentize} from 'polished';

const Container = styled.aside({
  flexShrink: 0,
  width: 305,
  borderRight: `1px solid ${colors.divider}`,
  overflowY: 'auto',
  position: 'relative'
});

const ResponsiveContainer = styled(Container)(props => ({
  [breakpoints.md]: {
    height: '100%',
    backgroundColor: 'white',
    boxShadow: `0 0 48px ${transparentize(0.75, 'black')}`,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    opacity: props.open ? 1 : 0,
    visibility: props.open ? 'visible' : 'hidden',
    transform: props.open ? 'none' : 'translateX(-100%)',
    transitionProperty: 'transform, opacity, visibility',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out'
  }
}));

const StyledHeader = styled(Header)({
  borderBottom: `1px solid ${colors.divider}`,
  fontSize: 18
});

const StyledLink = styled.a({
  color: 'inherit',
  textDecoration: 'none'
});

const Content = styled.div({
  padding: '20px 24px',
  paddingRight: 0
});

const Sidebar = React.forwardRef((props, ref) => {
  const content = (
    <Fragment>
      <StyledHeader>
        <StyledLink href={props.logoLink}>
          <LogoTitle noLogo={props.noLogo} title={props.title} />
        </StyledLink>
      </StyledHeader>
      <Content className={props.className}>{props.children}</Content>
    </Fragment>
  );

  if (props.responsive) {
    return (
      <ResponsiveContainer ref={ref} open={props.open}>
        {content}
      </ResponsiveContainer>
    );
  }

  return <Container>{content}</Container>;
});

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  open: PropTypes.bool,
  noLogo: PropTypes.bool,
  responsive: PropTypes.bool,
  logoLink: PropTypes.string,
  className: PropTypes.string
};

Sidebar.defaultProps = {
  logoLink: '/'
};

export default Sidebar;
