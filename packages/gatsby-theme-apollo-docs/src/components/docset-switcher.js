import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import styled from '@emotion/styled';
import {Button} from './buttons';
import {StyledIcon} from './select';
import {boxShadow} from './search';
import {colors, smallCaps} from 'gatsby-theme-apollo-core';
import {transparentize} from 'polished';

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
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1100
});

const Menu = styled.div({
  width: 700,
  padding: 24,
  borderRadius: 4,
  boxShadow,
  backgroundColor: 'white',
  position: 'absolute',
  top: 64,
  left: 24
});

const MenuTitle = styled.h6(smallCaps, {
  color: colors.text3
});

function getMenuOffset(element) {
  if (!element) {
    return 0;
  }

  const {top, height} = element.getBoundingClientRect();
  return top + height + 2;
}

export default function DocsetSwitcher(props) {
  const buttonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Menu style={{top: getMenuOffset(buttonRef.current)}}>
          <MenuTitle>Apollo Docs</MenuTitle>
        </Menu>
      </Backdrop>
    </Wrapper>
  );
}

DocsetSwitcher.propTypes = {
  title: PropTypes.string.isRequired
};
