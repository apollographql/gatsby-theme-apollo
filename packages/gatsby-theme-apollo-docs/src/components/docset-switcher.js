import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import styled from '@emotion/styled';
import useKey from 'react-use/lib/useKey';
import {IconTwitter} from '@apollo/space-kit/icons/IconTwitter';
import {IconYoutube} from '@apollo/space-kit/icons/IconYoutube';
import {ReactComponent as SpectrumIcon} from '../assets/logos/spectrum.svg';
import {boxShadow} from './search';
import {breakpoints, colors, smallCaps} from 'gatsby-theme-apollo-core';
import {graphql, useStaticQuery} from 'gatsby';
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

const MenuBase = styled.div({
  marginBottom: 16,
  borderRadius: 4
});

const Menu = styled(MenuBase)({
  width: 700,
  boxShadow,
  backgroundColor: 'white',
  overflow: 'hidden',
  position: 'absolute',
  transformOrigin: '25% 25%',
  transition: 'transform 150ms ease-in-out',
  [breakpoints.md]: {
    width: 450
  },
  [breakpoints.sm]: {
    width: 'calc(100vw - 32px)'
  }
});

const StandaloneMenu = styled(MenuBase)({
  padding: 12,
  backgroundColor: colors.background
});

const MenuTitle = styled.h6(smallCaps, {
  margin: 24,
  marginBottom: 0,
  fontSize: 13,
  fontWeight: 600,
  color: colors.text3
});

const NavWrapper = styled.div({
  margin: 12
});

const StyledNav = styled.nav({
  display: 'flex',
  flexWrap: 'wrap'
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
  '@media (hover: hover)': {
    ':hover': {
      color: 'white',
      backgroundColor: colors.primary,
      p: {
        color: colors.primaryLight
      }
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

function DocsetNav(props) {
  return (
    <StyledNav>
      {props.items.map(item => (
        <NavItem key={item.url}>
          <NavItemInner href={item.url}>
            <NavItemTitle>{item.title}</NavItemTitle>
            <NavItemDescription>{item.description}</NavItemDescription>
          </NavItemInner>
        </NavItem>
      ))}
    </StyledNav>
  );
}

DocsetNav.propTypes = {
  items: PropTypes.array.isRequired
};

export function StandaloneDocsetNav() {
  const {sitePlugin} = useStaticQuery(
    graphql`
      {
        sitePlugin(name: {eq: "gatsby-theme-apollo-docs"}) {
          pluginOptions {
            navItems {
              url
              title
              description
            }
          }
        }
      }
    `
  );

  return (
    <StandaloneMenu>
      <DocsetNav items={sitePlugin.pluginOptions.navItems} />
    </StandaloneMenu>
  );
}

export default function DocsetSwitcher(props) {
  useKey('Escape', props.onClose);

  function handleWrapperClick(event) {
    if (event.target === event.currentTarget) {
      props.onClose();
    }
  }

  return (
    <Wrapper
      onClick={handleWrapperClick}
      style={{
        opacity: props.open ? 1 : 0,
        visibility: props.open ? 'visible' : 'hidden'
      }}
    >
      <Menu
        style={{
          ...getMenuStyles(props.buttonRef.current),
          transform:
            !props.open && 'translate3d(0,-24px,-16px) rotate3d(1,0,0.1,8deg)'
        }}
      >
        <MenuTitle>{props.siteName}</MenuTitle>
        <NavWrapper>
          <DocsetNav items={props.navItems} />
        </NavWrapper>
        <FooterNav>
          {(props.footerNavItems || props.spectrumUrl || props.twitterUrl) && (
            <Fragment>
              {props.footerNavItems &&
                props.footerNavItems.map(({text, ...props}) => (
                  <FooterNavItem key={text} {...props}>
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
    </Wrapper>
  );
}

DocsetSwitcher.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonRef: PropTypes.object.isRequired,
  siteName: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired,
  footerNavItems: PropTypes.array.isRequired,
  spectrumUrl: PropTypes.string,
  twitterUrl: PropTypes.string,
  youtubeUrl: PropTypes.string
};
