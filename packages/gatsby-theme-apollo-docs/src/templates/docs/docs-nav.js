import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {colors} from 'gatsby-theme-apollo';

const Nav = styled.nav({
  display: 'flex',
  alignSelf: 'stretch',
  margin: '0 40px'
});

const NavItem = styled.a({
  display: 'flex',
  alignItems: 'center',
  padding: '0 4px',
  borderBottom: '2px solid transparent',
  fontSize: 18,
  color: colors.primary,
  textDecoration: 'none',
  '&.active': {
    borderColor: colors.secondary
  },
  ':not(:last-child)': {
    marginRight: 24
  }
});

const navItems = {
  '/docs/platform': 'Platform',
  '/docs/tutorial': 'Tutorial',
  '/docs/client': 'Client',
  '/docs/server': 'Server',
  '/docs/community': 'Community'
};

export default function DocsNav(props) {
  return (
    <Nav>
      {Object.keys(navItems).map(key => (
        <NavItem
          key={key}
          href={key}
          className={key === props.basePath ? 'active' : null}
        >
          {navItems[key]}
        </NavItem>
      ))}
    </Nav>
  );
}

DocsNav.propTypes = {
  basePath: PropTypes.string.isRequired
};
