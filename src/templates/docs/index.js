import Header from '../../components/header';
import Helmet from 'react-helmet';
import Layout from '../../components/layout';
import PageContent from './page-content';
import PropTypes from 'prop-types';
import React from 'react';
import Search from './search';
import SidebarNav from './sidebar-nav';
import VersionSelect from './version-select';
import colors from '../../util/colors';
import styled from '@emotion/styled';
import {ReactComponent as LogoSmall} from '../../../ui/logo-small.svg';
import {graphql} from 'gatsby';

const Container = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Sidebar = styled.aside({
  flexShrink: 0,
  width: 305,
  borderRight: `1px solid ${colors.divider}`,
  overflowY: 'auto',
  position: 'relative'
});

const SidebarHeader = styled(Header)({
  borderBottom: `1px solid ${colors.divider}`,
  fontSize: 18
});

const StyledLogoSmall = styled(LogoSmall)({
  marginRight: 8,
  height: 36,
  fill: 'currentColor'
});

const SidebarContent = styled.div({
  padding: '20px 24px',
  paddingRight: 0
});

const SidebarContentHeader = styled.h4({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: 16,
  fontWeight: 400,
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

const MainContent = styled.div({
  padding: '40px 64px'
});

const MainHeading = styled.h1({
  ':not(:last-child)': {
    marginBottom: 8
  }
});

const MainSubheading = styled.h3({
  fontWeight: 400,
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
  const {version, versions, frontmatter, content} = props.pageContext;
  const {title, description} = frontmatter;
  const {subtitle, basePath} = props.data.site.siteMetadata;
  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Container>
        <Sidebar>
          <SidebarHeader>
            <StyledLogoSmall />
            Apollo Docs
          </SidebarHeader>
          <SidebarContent>
            <SidebarContentHeader>
              {subtitle}
              <VersionSelect versions={versions} value={version.basePath} />
            </SidebarContentHeader>
            <SidebarNav
              contents={version.contents}
              pathname={props.location.pathname}
            />
          </SidebarContent>
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
          <MainContent>
            <div>
              <MainHeading>{title}</MainHeading>
              {description && <MainSubheading>{description}</MainSubheading>}
            </div>
            <hr />
            <PageContent content={content} />
          </MainContent>
        </Main>
      </Container>
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
        subtitle
        basePath
      }
    }
  }
`;
