import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import breakpoints from '../utils/breakpoints';
import styled from '@emotion/styled';
import {ApolloIcon} from '@apollo/space-kit/icons/ApolloIcon';
import {colors} from '../utils/colors';
import {transparentize} from 'polished';

const Container = styled.aside({
  flexShrink: 0,
  width: 305,
  height: '100vh',
  padding: 20,
  borderRight: `1px solid ${colors.divider}`,
  overflowY: 'auto',
  position: 'sticky',
  top: 0
});

const ResponsiveContainer = styled(Container)(props => ({
  [breakpoints.md]: {
    height: '100%',
    backgroundColor: 'white',
    boxShadow: `0 0 48px ${transparentize(0.75, 'black')}`,
    position: 'absolute',
    zIndex: 2,
    opacity: props.open ? 1 : 0,
    visibility: props.open ? 'visible' : 'hidden',
    transform: props.open ? 'none' : 'translateX(-100%)',
    transitionProperty: 'transform, opacity, visibility',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out'
  }
}));

const Header = styled.div({
  marginBottom: 20
});

const StyledLink = styled.a({
  color: colors.text1,
  textDecoration: 'none'
});

const Sidebar = React.forwardRef((props, ref) => {
  const content = (
    <Fragment>
      <Header>
        <StyledLink href={props.logoLink}>
          <ApolloIcon
            style={{
              display: 'block',
              height: 28
            }}
          />
        </StyledLink>
      </Header>
      <div className={props.className}>{props.children}</div>
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
  open: PropTypes.bool,
  responsive: PropTypes.bool,
  logoLink: PropTypes.string,
  className: PropTypes.string
};

Sidebar.defaultProps = {
  logoLink: '/'
};

export default Sidebar;
