import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import styled from '@emotion/styled';
import useKey from 'react-use/lib/useKey';
import {Button} from './buttons';
import {IconVariant} from '@apollo/space-kit/icons/IconVariant';
import {boxShadow} from './search';
import {breakpoints, colors, smallCaps} from 'gatsby-theme-apollo-core';
import {iconStyles} from './select';
import {size, transparentize} from 'polished';

const Wrapper = styled.div({
  flexGrow: 1,
  position: 'relative'
});

const StyledButton = styled(Button)({
  width: '100%',
  textAlign: 'left',
  position: 'relative'
});

const Backdrop = styled.div({
  width: '100%',
  height: '100%',
  backgroundColor: transparentize(0.5, colors.text2),
  overflow: 'auto',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1100,
  transitionProperty: 'opacity, visibility',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-in-out'
});

const Menu = styled.div({
  width: 700,
  padding: 12,
  borderRadius: 4,
  boxShadow,
  backgroundColor: 'white',
  position: 'absolute',
  // transformOrigin: 'top left',
  transition: 'transform 150ms ease-in-out',
  [breakpoints.md]: {
    width: 400
  }
});

const MenuTitle = styled.h6(smallCaps, {
  marginBottom: 0,
  padding: 12,
  color: colors.text3
});

const navItemSpacing = 4;
const StyledNav = styled.nav({
  display: 'flex',
  flexWrap: 'wrap',
  margin: -navItemSpacing
});

const NavItem = styled.div({
  display: 'block',
  width: '50%',
  padding: navItemSpacing,
  [breakpoints.md]: {
    width: '100%'
  }
});

const NavItemInner = styled.a({
  display: 'block',
  height: '100%',
  padding: 12,
  borderRadius: 4,
  color: colors.text1,
  textDecoration: 'none',
  backgroundColor: 'transparent',
  transitionProperty: 'color, background-color',
  transitionDuration: '250ms',
  transitionTimingFunction: 'ease-in-out',
  ':hover': {
    color: 'white',
    backgroundColor: colors.primary
  }
});

const NavItemTitle = styled.h4({
  marginBottom: 8,
  fontWeight: 600,
  color: 'inherit'
});

const NavItemDescription = styled.p({
  marginBottom: 0,
  fontSize: 14,
  lineHeight: 1.5,
  opacity: 2 / 3
});

const StyledIcon = styled(IconVariant)(size(16), iconStyles);

function getMenuStyles(element) {
  if (!element) {
    return null;
  }

  const {top, left, height} = element.getBoundingClientRect();
  return {
    top: top + height + 2,
    left
  };
}

export default function DocsetSwitcher(props) {
  const buttonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useKey('Escape', () => {
    setMenuOpen(false);
  });

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu(event) {
    if (event.target === event.currentTarget) {
      setMenuOpen(false);
    }
  }

  return (
    <Wrapper>
      <StyledButton
        variant="flat"
        color="branded"
        size="small"
        className="title-sidebar"
        onClick={openMenu}
        ref={buttonRef}
      >
        {props.title}
        <StyledIcon />
      </StyledButton>
      <Backdrop
        onClick={closeMenu}
        style={{
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden'
        }}
      >
        <Menu
          style={{
            ...getMenuStyles(buttonRef.current),
            transform: menuOpen ? 'scale(1)' : 'translateY(-10%) scale(0.9)'
          }}
        >
          <MenuTitle>{props.siteName}</MenuTitle>
          <StyledNav>
            {props.navItems.map(navItem => (
              <NavItem key={navItem.path}>
                <NavItemInner href={navItem.path}>
                  <NavItemTitle>{navItem.text}</NavItemTitle>
                  <NavItemDescription>{navItem.description}</NavItemDescription>
                </NavItemInner>
              </NavItem>
            ))}
          </StyledNav>
        </Menu>
      </Backdrop>
    </Wrapper>
  );
}

DocsetSwitcher.propTypes = {
  title: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired
};
