import Helmet from 'react-helmet';
import PageContent from './page-content';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Search from './search';
import SelectLink from './select-link';
import socialImage from '../assets/images/social.jpg';
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
  breakpoints,
  colors
} from 'gatsby-theme-apollo';
import {graphql} from 'gatsby';

const StyledLogoTitle = styled(LogoTitle)({
  marginRight: 'auto'
});

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
  marginLeft: 'auto',
  paddingLeft: 40,
  [breakpoints.sm]: {
    display: 'none'
  }
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

const headerNavOptions = Object.entries({
  '/docs/platform': 'Platform',
  '/docs/tutorial': 'Tutorial',
  '/docs/client': 'Client',
  '/docs/server': 'Server',
  '/docs/community': 'Community'
}).map(([value, text]) => ({
  value,
  text
}));

export default class Template extends Component {
  render() {
    const {
      version,
      versions,
      title,
      description,
      content,
      filePath
    } = this.props.pageContext;

    const {
      title: siteTitle,
      description: siteDescription,
      subtitle
    } = this.props.data.site.siteMetadata;

    return (
      <Layout>
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:site_name" content={siteTitle} />
          <meta
            property="og:description"
            content={description || siteDescription}
          />
          <meta property="og:image" content={socialImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@apollographql" />
          <meta name="twitter:title" content={title} />
          <meta
            name="twitter:description"
            content={description || siteDescription}
          />
          <meta
            name="twitter:image"
            content={'https://apollographql.com' + socialImage}
          />
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
                title={siteTitle}
              >
                <SidebarContentHeader>
                  {subtitle}
                  <SelectLink
                    value={version.basePath}
                    options={versions.map(({majorMinor, basePath}) => ({
                      text: `Version ${majorMinor}`,
                      value: basePath
                    }))}
                  />
                </SidebarContentHeader>
                <SidebarNav
                  contents={version.contents}
                  pathname={this.props.location.pathname}
                />
              </Sidebar>
              <Main>
                <MobileHeader>
                  <MenuButton onClick={openSidebar} />
                  <StyledLogoTitle />
                  <SelectLink
                    large
                    options={headerNavOptions}
                    value={version.basePath}
                  />
                </MobileHeader>
                <DesktopHeader>
                  <Search />
                  <Nav>
                    {headerNavOptions.map(({value, text}) => (
                      <NavItem
                        key={value}
                        href={value}
                        className={
                          value === this.props.data.site.siteMetadata.basePath
                            ? 'active'
                            : null
                        }
                      >
                        {text}
                      </NavItem>
                    ))}
                  </Nav>
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
                    filePath={filePath}
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

Template.propTypes = {
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
