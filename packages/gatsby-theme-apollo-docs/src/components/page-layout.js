import '../prism.less';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import DocsetSwitcher from './docset-switcher';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import Search from './search';
import SelectLink from './select-link';
import styled from '@emotion/styled';
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
  getVersionBasePath,
  trackEvent
} from '../utils';
import {graphql, useStaticQuery} from 'gatsby';

const Main = styled.main({
  flexGrow: 1,
  outline: 'none',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
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

  const {
    sidebarRef,
    handleWrapperClick,
    openSidebar,
    sidebarOpen
  } = useResponsiveSidebar();

  const {pathname} = props.location;
  const {siteName, title, subtitle} = data.site.siteMetadata;
  const {sidebarContents, versions, defaultVersion} = props.pageContext;

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
          logoLink={props.logoLink}
        >
          <HeaderInner>
            <DocsetSwitcher
              title={subtitle}
              siteName={siteName}
              footerN={props.navConfig}
              footerNavConfig={props.footerNavConfig}
            />
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
              apiKey={props.algoliaApiKey}
              indexName={props.algoliaIndexName}
            />
          </Header>
          <MainRefContext.Provider value={mainRef}>
            {props.children}
          </MainRefContext.Provider>
        </Main>
      </FlexWrapper>
    </Layout>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  navConfig: PropTypes.object.isRequired,
  footerNavConfig: PropTypes.object.isRequired,
  algoliaApiKey: PropTypes.string.isRequired,
  algoliaIndexName: PropTypes.string.isRequired,
  logoLink: PropTypes.string
};
