import PropTypes from 'prop-types';
import React, {Fragment, useRef, useState} from 'react';
import styled from '@emotion/styled';
import useKey from 'react-use/lib/useKey';
import {Button} from './buttons';
import {IconLayoutModule} from '@apollo/space-kit/icons/IconLayoutModule';
import {IconTwitter} from '@apollo/space-kit/icons/IconTwitter';
import {IconYoutube} from '@apollo/space-kit/icons/IconYoutube';
import {ReactComponent as SpectrumIcon} from '../assets/logos/spectrum.svg';
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
  perspective: '1000px',
  transitionProperty: 'opacity, visibility',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-in-out'
});

const Menu = styled.div({
  width: 700,
  borderRadius: 4,
  boxShadow,
  backgroundColor: 'white',
  overflow: 'hidden',
  position: 'absolute',
  transformOrigin: '25% 25%',
  transition: 'transform 150ms ease-in-out',
  [breakpoints.md]: {
    width: 400
  }
});

const MenuTitle = styled.h6(smallCaps, {
  margin: 24,
  marginBottom: 0,
  fontSize: 13,
  fontWeight: 600,
  color: colors.text3
});

const StyledNav = styled.nav({
  display: 'flex',
  flexWrap: 'wrap',
  margin: 12
});

const NavItem = styled.div({
  display: 'block',
  width: '50%',
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
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-in-out',
  ':hover': {
    color: 'white',
    backgroundColor: colors.primary,
    p: {
      color: colors.primaryLight
    }
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
  color: colors.text3,
  transition: 'color 150ms ease-in-out'
});

const StyledIcon = styled(IconLayoutModule)(size(16), iconStyles);

const FooterNav = styled.nav({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: colors.background
});

const FooterNavItem = styled.a({
  color: colors.text2,
  textDecoration: 'none',
  ':hover': {
    color: colors.text3
  },
  ':not(:last-child)': {
    marginRight: 24
  }
});

const SocialLinks = styled.div({
  display: 'flex',
  marginLeft: 'auto'
});

const SocialLink = styled.a({
  color: colors.text2,
  ':hover': {
    color: colors.text3
  },
  ':not(:last-child)': {
    marginRight: 24
  },
  svg: {
    ...size(24),
    display: 'block',
    fill: 'currentColor'
  }
});

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
            transform:
              !menuOpen && 'translate3d(0,-24px,-16px) rotate3d(1,0,0.1,8deg)'
          }}
        >
          <MenuTitle>{props.siteName}</MenuTitle>
          <StyledNav>
            {Object.entries(props.navConfig).map(([path, navItem]) => (
              <NavItem key={path}>
                <NavItemInner href={path}>
                  <NavItemTitle>{navItem.text}</NavItemTitle>
                  <NavItemDescription>{navItem.description}</NavItemDescription>
                </NavItemInner>
              </NavItem>
            ))}
          </StyledNav>
          <FooterNav>
            {(props.footerNavConfig ||
              props.spectrumUrl ||
              props.twitterUrl) && (
              <Fragment>
                {props.footerNavConfig &&
                  Object.entries(props.footerNavConfig).map(([text, url]) => (
                    <FooterNavItem key={text} href={url} target="_blank">
                      {text}
                    </FooterNavItem>
                  ))}
                {(props.spectrumUrl || props.twitterUrl) && (
                  <SocialLinks>
                    {props.spectrumUrl && (
                      <SocialLink
                        href={props.spectrumUrl}
                        title="Spectrum"
                        target="_blank"
                      >
                        <SpectrumIcon />
                      </SocialLink>
                    )}
                    {props.twitterUrl && (
                      <SocialLink
                        href={props.twitterUrl}
                        title="Twitter"
                        target="_blank"
                      >
                        <IconTwitter />
                      </SocialLink>
                    )}
                    {props.youtubeUrl && (
                      <SocialLink
                        href={props.youtubeUrl}
                        title="YouTube"
                        target="_blank"
                      >
                        <IconYoutube />
                      </SocialLink>
                    )}
                  </SocialLinks>
                )}
              </Fragment>
            )}
          </FooterNav>
        </Menu>
      </Backdrop>
    </Wrapper>
  );
}

DocsetSwitcher.propTypes = {
  title: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  navConfig: PropTypes.object.isRequired,
  footerNavConfig: PropTypes.object.isRequired,
  spectrumUrl: PropTypes.string,
  twitterUrl: PropTypes.string,
  youtubeUrl: PropTypes.string
};
