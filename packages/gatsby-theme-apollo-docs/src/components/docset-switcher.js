import PropTypes from 'prop-types';
import React, {Fragment, useEffect, useMemo, useRef} from 'react';
import styled from '@emotion/styled';
import useKey from 'react-use/lib/useKey';
import useWindowSize from 'react-use/lib/useWindowSize';
import {IconTwitter} from '@apollo/space-kit/icons/IconTwitter';
import {IconYoutube} from '@apollo/space-kit/icons/IconYoutube';
import {ReactComponent as SpectrumIcon} from '../assets/spectrum.svg';
import {boxShadow} from './search';
import {breakpoints, colors, smallCaps} from 'gatsby-theme-apollo-core';
import {size, transparentize} from 'polished';

const Wrapper = styled.div({
  width: '100%',
  height: '100%',
  backgroundColor: transparentize(0.5, colors.text2),
  overflow: 'auto',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 3,
  perspective: '1000px',
  transitionProperty: 'opacity, visibility',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-in-out'
});

const transitionDuration = 150; // in ms
const Menu = styled.div({
  width: 400,
  marginBottom: 24,
  borderRadius: 4,
  boxShadow,
  backgroundColor: 'white',
  overflow: 'hidden',
  position: 'absolute',
  transformOrigin: '25% 25%',
  transition: `transform ${transitionDuration}ms ease-in-out`,
  outline: 'none',
  [breakpoints.md]: {
    width: 450
  },
  [breakpoints.sm]: {
    width: 'calc(100vw - 48px)'
  }
});

const MenuTitle = styled.h6({
  padding: 15,
  marginBottom: 0,
  fontSize: 22,
  color: colors.text2,
  background: colors.background
});

const NavListTitle = styled.h6(smallCaps, {
  marginLeft: 12,
  marginBottom: 0,
  fontSize: 13,
  fontWeight: 600,
  color: colors.text3
});

const NavList = styled.ul({
  margin: 0,
  marginBottom: 20
});

const NavListItem = styled.li({
  listStyle: 'none',
  margin: 2,
  marginLeft: 3
});

const NavListItemLink = styled.a({
  display: 'block',
  height: '100%',
  padding: 8,
  borderRadius: 4,
  textDecoration: 'none',
  backgroundColor: 'transparent',
  transitionProperty: 'color, background-color',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-in-out',
  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: colors.primary,
      'h4': {
        color: 'white'
      }
    }
  }
});

const NavListItemTitle = styled.h4({
  marginBottom: 0,
  fontWeight: 600,
  color: colors.text1
});

const StyledNav = styled.nav({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  margin: 12,
  maxHeight: 250,
  paddingTop: 15,
  [breakpoints.md]: {
    maxHeight: 'none',
    width: 300
  }
});

const NavItem = styled.div({
  display: 'block',
  width: '50%',
  [breakpoints.md]: {
    width: '100%'
  }
});

const FooterNav = styled.nav({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: colors.background,
  [breakpoints.md]: {
    display: 'block'
  }
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
  marginLeft: 'auto',
  [breakpoints.md]: {
    marginTop: 8
  }
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

export default function DocsetSwitcher(props) {
  const menuRef = useRef(null);
  const {width} = useWindowSize();
  useKey('Escape', props.onClose);

  useEffect(() => {
    if (props.open) {
      // focus the menu after it has been transitioned in
      setTimeout(() => {
        menuRef.current.focus();
      }, transitionDuration);
    }
  }, [props.open]);

  const {current} = props.buttonRef;
  const menuStyles = useMemo(() => {
    if (!current) {
      return null;
    }

    const {top, left, height} = current.getBoundingClientRect();
    return {
      top: top + height + 2,
      left
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, width, props.open]);

  function handleWrapperClick(event) {
    if (event.target === event.currentTarget) {
      props.onClose();
    }
  }

  const hasSocialUrls = Boolean(
    props.spectrumUrl || props.twitterUrl || props.youtubeUrl
  );
  return (
    <Wrapper
      onClick={handleWrapperClick}
      style={{
        opacity: props.open ? 1 : 0,
        visibility: props.open ? 'visible' : 'hidden'
      }}
    >
      <Menu
        ref={menuRef}
        tabIndex={-1}
        style={{
          ...menuStyles,
          transform:
            !props.open && 'translate3d(0,-24px,-16px) rotate3d(1,0,0.1,8deg)'
        }}
      >
        <MenuTitle>{props.siteName}</MenuTitle>

        <StyledNav>
          {props.navCategories.map(navCategory => (
            <NavItem>
              {(navCategory.categoryTitle !== 'null') && (
                <NavListTitle>{navCategory.categoryTitle}</NavListTitle>
              )}
              <NavList key={navCategory.categoryTitle}>
                {console.log(navCategory)}
                {Object.entries(navCategory).map(([title, navItem]) => (<>
                  {(title !== 'categoryTitle') &&
                  (<NavListItem key={navItem.url}>
                    <NavListItemLink href={navItem.url} title={navItem.description}>
                      <NavListItemTitle>{title}</NavListItemTitle>
                    </NavListItemLink>
                  </NavListItem>)}
                </>))}
              </NavList>
            </NavItem>
          ))}
        </StyledNav>
        {(props.footerNavConfig || hasSocialUrls) && (
          <FooterNav>
            <Fragment>
              {props.footerNavConfig &&
                Object.entries(props.footerNavConfig).map(([text, props]) => (
                  <FooterNavItem key={text} {...props}>
                    {text}
                  </FooterNavItem>
                ))}
              {hasSocialUrls && (
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
          </FooterNav>
        )}
      </Menu>
    </Wrapper>
  );
}

DocsetSwitcher.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonRef: PropTypes.object.isRequired,
  siteName: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired,
  navCategories: PropTypes.array.isRequired,
  footerNavConfig: PropTypes.object.isRequired,
  spectrumUrl: PropTypes.string,
  twitterUrl: PropTypes.string,
  youtubeUrl: PropTypes.string
};
