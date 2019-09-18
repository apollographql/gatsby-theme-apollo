import '../prism.less';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import DocsetSwitcher from './docset-switcher';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import Search from './search';
import SelectLink from './select-link';
import styled from '@emotion/styled';
import {Button} from './buttons';
import {
  FlexWrapper,
  Header,
  Layout,
  MenuButton,
  Sidebar,
  SidebarNav,
  StyledLogo,
  breakpoints,
  useResponsiveSidebar
} from 'gatsby-theme-apollo-core';
import {
  GA_EVENT_CATEGORY_SIDEBAR,
  MainRefContext,
  getSpectrumUrl,
  getVersionBasePath,
  trackEvent
} from '../utils';
import {IconLayoutModule} from '@apollo/space-kit/icons/IconLayoutModule';
import {graphql, useStaticQuery} from 'gatsby';
import {iconStyles} from './select';
import {size} from 'polished';

const Main = styled.main({
  flexGrow: 1,
  outline: 'none',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
});

const StyledButton = styled(Button)({
  width: '100%',
  textAlign: 'left',
  position: 'relative'
});

const StyledIcon = styled(IconLayoutModule)(size(16), iconStyles);

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

function getVersionLabel(version) {
  return `v${version}`;
}

function handleToggleAll(expanded) {
  trackEvent({
    eventCategory: GA_EVENT_CATEGORY_SIDEBAR,
    eventAction: 'toggle all',
    eventLabel: expanded ? 'expand' : 'collapse'
  });
}

function handleToggleCategory(title, expanded) {
  trackEvent({
    eventCategory: GA_EVENT_CATEGORY_SIDEBAR,
    eventAction: 'toggle category',
    eventLabel: title,
    eventValue: Number(expanded)
  });
}

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
  const {sidebarContents, versions, defaultVersion} = props.pageContext;
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

  return (
    <Layout>
      <Helmet titleTemplate={`%s - ${subtitle} - ${title}`}>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        />
      </Helmet>
      <FlexWrapper onClick={handleWrapperClick}>
        <Sidebar
          responsive
          className="sidebar"
          open={sidebarOpen}
          ref={sidebarRef}
          title={siteName}
          logoLink={logoLink}
        >
          <HeaderInner>
            <StyledButton
              variant="flat"
              color="branded"
              size="small"
              className="title-sidebar"
              onClick={openMenu}
              ref={buttonRef}
            >
              {subtitle}
              <StyledIcon />
            </StyledButton>
            {versions && versions.length > 0 && (
              <SelectLink
                useLink
                size="small"
                variant="hidden"
                isPathActive={value => pathname.startsWith(value)}
                style={{marginLeft: 8}}
                options={[
                  {
                    text: defaultVersion
                      ? getVersionLabel(defaultVersion)
                      : 'Latest',
                    value: '/'
                  }
                ].concat(
                  versions.map(version => ({
                    text: getVersionLabel(version),
                    value: getVersionBasePath(version)
                  }))
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
          </Header>
          <MainRefContext.Provider value={mainRef}>
            {props.children}
          </MainRefContext.Provider>
        </Main>
      </FlexWrapper>
      <DocsetSwitcher
        siteName={menuTitle || siteName}
        spectrumUrl={spectrumHandle && getSpectrumUrl(spectrumHandle)}
        twitterUrl={twitterHandle && `https://twitter.com/${twitterHandle}`}
        youtubeUrl={youtubeUrl}
        navConfig={navConfig}
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
