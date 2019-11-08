import '../prism.less';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import DocsetSwitcher from './docset-switcher';
import HeaderButton from './header-button';
import PropTypes from 'prop-types';
import React, {createContext, useMemo, useRef, useState} from 'react';
import Search from './search';
import styled from '@emotion/styled';
import {Button} from '@apollo/space-kit/Button';
import {
  FlexWrapper,
  Header,
  Layout,
  MenuButton,
  Sidebar,
  SidebarNav,
  StyledLogo,
  breakpoints,
  colors,
  useResponsiveSidebar
} from 'gatsby-theme-apollo-core';
import {Helmet} from 'react-helmet';
import {IconLayoutModule} from '@apollo/space-kit/icons/IconLayoutModule';
import {Link, graphql, navigate, useStaticQuery} from 'gatsby';
import {MainRefContext, getSpectrumUrl, getVersionBasePath} from '../utils';
import {Select} from './select';
import {size} from 'polished';

const Main = styled.main({
  flexGrow: 1,
  outline: 'none',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
});

const ButtonWrapper = styled.div({
  flexGrow: 1
});

const StyledButton = styled(Button)({
  width: '100%',
  ':not(:hover)': {
    backgroundColor: colors.background
  }
});

const StyledIcon = styled(IconLayoutModule)(size(16), {
  marginLeft: 'auto'
});

const MobileNav = styled.div({
  display: 'none',
  [breakpoints.md]: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto'
  }
});

const HeaderInner = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginLeft: -8,
  marginBottom: 16,
  paddingRight: 16
});

const Eyebrow = styled.div({
  flexShrink: 0,
  padding: 8,
  backgroundColor: colors.background,
  color: colors.primary,
  textAlign: 'center',
  fontSize: 14,
  position: 'sticky',
  top: 0,
  a: {
    color: 'inherit',
    fontWeight: 600
  }
});

function getVersionLabel(version) {
  return `v${version}`;
}

const GA_EVENT_CATEGORY_SIDEBAR = 'Sidebar';

function handleToggleAll(expanded) {
  if (typeof window.analytics !== 'undefined') {
    window.analytics.track('Toggle all', {
      category: GA_EVENT_CATEGORY_SIDEBAR,
      label: expanded ? 'expand' : 'collapse'
    });
  }
}

function handleToggleCategory(title, expanded) {
  if (typeof window.analytics !== 'undefined') {
    window.analytics.track('Toggle category', {
      category: GA_EVENT_CATEGORY_SIDEBAR,
      label: title,
      value: Number(expanded)
    });
  }
}

export const NavItemsContext = createContext();

export default function PageLayout(props) {
  const mainRef = useRef(null);
  const sidebarRef = useRef(null);

  const data = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            title
            siteName
            subtitle
          }
        }
      }
    `
  );

  const {openSidebar, closeSidebar, sidebarOpen} = useResponsiveSidebar();

  const buttonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleWrapperClick(event) {
    if (sidebarOpen && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  }

  const {pathname} = props.location;
  const {siteName, title, subtitle} = data.site.siteMetadata;
  const {
    sidebarContents,
    versions,
    versionDifference,
    versionBasePath,
    defaultVersion
  } = props.pageContext;
  const {
    spectrumHandle,
    twitterHandle,
    youtubeUrl,
    navConfig,
    footerNavConfig,
    logoLink,
    algoliaApiKey,
    algoliaIndexName,
    menuTitle
  } = props.pluginOptions;

  const navItems = useMemo(
    () =>
      Object.entries(navConfig).map(([title, navItem]) => ({
        ...navItem,
        title
      })),
    [navConfig]
  );

  return (
    <Layout>
      <Helmet titleTemplate={`%s - ${subtitle} - ${title}`}>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Helmet>
      <FlexWrapper
        onClick={handleWrapperClick}
        beforeContent={
          versionDifference !== 0 && (
            <Eyebrow>
              You&apos;re viewing documentation for a{' '}
              {versionDifference > 0
                ? 'version of this software that is in development'
                : 'previous version of this software'}
              . <Link to="/">Switch to the latest stable version</Link>
            </Eyebrow>
          )
        }
      >
        <Sidebar
          responsive
          className="sidebar"
          open={sidebarOpen}
          ref={sidebarRef}
          title={siteName}
          logoLink={logoLink}
        >
          <HeaderInner>
            <ButtonWrapper ref={buttonRef}>
              <StyledButton
                feel="flat"
                color={colors.primary}
                size="small"
                onClick={openMenu}
                style={{display: 'block'}}
              >
                <span className="title-sidebar">{subtitle}</span>
                <StyledIcon />
              </StyledButton>
            </ButtonWrapper>

            {versions && versions.length > 0 && (
              <Select
                feel="flat"
                size="small"
                value={versionDifference ? versionBasePath : '/'}
                onChange={navigate}
                style={{marginLeft: 8}}
                options={versions.reduce(
                  (acc, version) => ({
                    ...acc,
                    [getVersionBasePath(version)]: getVersionLabel(version)
                  }),
                  {
                    '/': defaultVersion
                      ? getVersionLabel(defaultVersion)
                      : 'Latest'
                  }
                )}
              />
            )}
          </HeaderInner>
          {sidebarContents && (
            <SidebarNav
              contents={sidebarContents}
              pathname={pathname}
              onToggleAll={handleToggleAll}
              onToggleCategory={handleToggleCategory}
              onLinkClick={sidebarOpen ? closeSidebar : null}
            />
          )}
        </Sidebar>
        {/* we give the component a key so it resets the scroll when the pathname changes */}
        <Main ref={mainRef} key={props.location.pathname} tabIndex={0}>
          <Header>
            <MobileNav>
              <MenuButton onClick={openSidebar} />
              <StyledLogo />
            </MobileNav>
            <Search
              siteName={siteName}
              apiKey={algoliaApiKey}
              indexName={algoliaIndexName}
            />
            <HeaderButton />
          </Header>
          <MainRefContext.Provider value={mainRef}>
            <NavItemsContext.Provider value={navItems}>
              {props.children}
            </NavItemsContext.Provider>
          </MainRefContext.Provider>
        </Main>
      </FlexWrapper>
      <DocsetSwitcher
        siteName={menuTitle || siteName}
        spectrumUrl={spectrumHandle && getSpectrumUrl(spectrumHandle)}
        twitterUrl={twitterHandle && `https://twitter.com/${twitterHandle}`}
        youtubeUrl={youtubeUrl}
        navItems={navItems}
        footerNavConfig={footerNavConfig}
        open={menuOpen}
        buttonRef={buttonRef}
        onClose={closeMenu}
      />
    </Layout>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  pluginOptions: PropTypes.object.isRequired
};
