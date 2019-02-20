import Helmet from 'react-helmet';
import PageContent from './page-content';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Search from './search';
import VersionSelect from './version-select';
import styled from '@emotion/styled';
import {
  ContentWrapper,
  DesktopHeader,
  FlexWrapper,
  Layout,
  LogoTitle,
  MenuButton,
  MobileHeader,
  ResponsiveSidebar,
  Sidebar,
  SidebarNav,
  colors
} from 'gatsby-theme-apollo';
import {graphql} from 'gatsby';

const SidebarContentHeader = styled.h4({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: 16,
  color: colors.primary
});

const Main = styled.main({
  flexGrow: 1,
  overflowY: 'auto'
});

const MainHeading = styled.h1({
  ':not(:last-child)': {
    marginBottom: 8
  }
});

const MainSubheading = styled.h3({
  color: colors.text2
});

const Nav = styled.nav({
  display: 'flex',
  alignSelf: 'stretch',
  marginleft: 'auto',
  paddingLeft: 40
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

export default class Docs extends Component {
  renderHeaderNav() {
    return (
      <Nav>
        {Object.keys(navItems).map(key => (
          <NavItem
            key={key}
            href={key}
            className={
              key === this.props.data.site.siteMetadata.basePath
                ? 'active'
                : null
            }
          >
            {navItems[key]}
          </NavItem>
        ))}
      </Nav>
    );
  }

  render() {
    const {
      version,
      versions,
      title,
      description,
      content,
      fileDir
    } = this.props.pageContext;
    const {title: pageTitle, subtitle} = this.props.data.site.siteMetadata;
    return (
      <Layout>
        <Helmet>
          <title>{title}</title>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
          />
        </Helmet>
        <ResponsiveSidebar>
          {({sidebarRef, onWrapperClick, openSidebar, sidebarOpen}) => (
            <FlexWrapper onClick={onWrapperClick}>
              <Sidebar
                responsive
                open={sidebarOpen}
                ref={sidebarRef}
                title={pageTitle}
              >
                <SidebarContentHeader>
                  {subtitle}
                  <VersionSelect versions={versions} value={version.basePath} />
                </SidebarContentHeader>
                <SidebarNav
                  contents={version.contents}
                  pathname={this.props.location.pathname}
                />
              </Sidebar>
              <Main>
                <MobileHeader>
                  <MenuButton onClick={openSidebar} />
                  <LogoTitle />
                  {this.renderHeaderNav()}
                </MobileHeader>
                <DesktopHeader>
                  <Search />
                  {this.renderHeaderNav()}
                </DesktopHeader>
                <ContentWrapper>
                  <div>
                    <MainHeading>{title}</MainHeading>
                    {description && (
                      <MainSubheading>{description}</MainSubheading>
                    )}
                  </div>
                  <hr />
                  <PageContent
                    content={content}
                    fileDir={fileDir}
                    version={version}
                  />
                </ContentWrapper>
              </Main>
            </FlexWrapper>
          )}
        </ResponsiveSidebar>
      </Layout>
    );
  }
}

Docs.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        subtitle
        basePath
      }
    }
  }
`;
