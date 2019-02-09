import ContentWrapper from 'gatsby-theme-apollo/src/components/content-wrapper';
import FlexWrapper from 'gatsby-theme-apollo/src/components/flex-wrapper';
import Header from 'gatsby-theme-apollo/src/components/header';
import Helmet from 'react-helmet';
import Layout from 'gatsby-theme-apollo/src/components/layout';
import PageContent from './page-content';
import PropTypes from 'prop-types';
import React from 'react';
import Search from './search';
import Sidebar from 'gatsby-theme-apollo/src/components/sidebar';
import SidebarNav from 'gatsby-theme-apollo/src/components/sidebar-nav';
import VersionSelect from './version-select';
import colors from 'gatsby-theme-apollo/src/util/colors';
import styled from '@emotion/styled';
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

const Nav = styled.nav({
  display: 'flex',
  alignSelf: 'stretch',
  margin: '0 40px'
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

const MainHeading = styled.h1({
  ':not(:last-child)': {
    marginBottom: 8
  }
});

const MainSubheading = styled.h3({
  color: colors.text2
});

const navItems = {
  '/docs/platform': 'Platform',
  '/docs/tutorial': 'Tutorial',
  '/docs/client': 'Client',
  '/docs/server': 'Server',
  '/docs/community': 'Community'
};

export default function Docs(props) {
  const {version, versions, title, description, content} = props.pageContext;
  const {title: pageTitle, subtitle, basePath} = props.data.site.siteMetadata;
  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        />
      </Helmet>
      <FlexWrapper>
        <Sidebar title={pageTitle}>
          <SidebarContentHeader>
            {subtitle}
            <VersionSelect versions={versions} value={version.basePath} />
          </SidebarContentHeader>
          <SidebarNav
            contents={version.contents}
            pathname={props.location.pathname}
          />
        </Sidebar>
        <Main>
          <Header>
            <Search />
            <Nav>
              {Object.keys(navItems).map(key => (
                <NavItem
                  key={key}
                  href={key}
                  className={key === basePath ? 'active' : null}
                >
                  {navItems[key]}
                </NavItem>
              ))}
            </Nav>
          </Header>
          <ContentWrapper>
            <div>
              <MainHeading>{title}</MainHeading>
              {description && <MainSubheading>{description}</MainSubheading>}
            </div>
            <hr />
            <PageContent content={content} />
          </ContentWrapper>
        </Main>
      </FlexWrapper>
    </Layout>
  );
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
