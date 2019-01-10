import Helmet from 'react-helmet';
import Layout from '../../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import Search from './search';
import SidebarNav from './sidebar-nav';
import VersionSelect from './version-select';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {ReactComponent as Logo} from '../../assets/logo.svg';

const colors = {
  primary: '#220a82',
  secondary: '#e535ab',
  divider: '#d8d9e0'
};

const Container = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Header = styled.header({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  height: 64,
  padding: '0 24px',
  color: colors.primary,
  backgroundColor: 'white',
  position: 'sticky',
  top: 0
});

const Sidebar = styled.aside({
  flexShrink: 0,
  width: 305,
  borderRight: `1px solid ${colors.divider}`,
  overflowY: 'auto'
});

const SidebarHeader = styled(Header)({
  borderBottom: `1px solid ${colors.divider}`
});

const StyledLogo = styled(Logo)({
  marginRight: 'auto',
  height: 36,
  fill: 'currentColor'
});

const SidebarContent = styled.div({
  padding: '16px 24px'
});

const Main = styled.main({
  flexGrow: 1,
  overflowY: 'auto'
});

const Nav = styled.nav({
  display: 'flex',
  alignSelf: 'stretch',
  marginLeft: 'auto'
});

const NavItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  padding: '0 4px',
  borderBottom: '2px solid transparent',
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
  display: 'flex'
});

const Contents = styled.aside({
  flexShrink: 0,
  width: 200,
  position: 'sticky',
  top: 0
});

export default function Docs(props) {
  const {version, versions, frontmatter, html, headings} = props.pageContext;
  return (
    <Layout>
      <Helmet>
        <title>{frontmatter.title}</title>
      </Helmet>
      <Container>
        <Sidebar>
          <SidebarHeader>
            <StyledLogo />
          </SidebarHeader>
          <SidebarContent>
            <VersionSelect versions={versions} value={version.basePath} />
            <SidebarNav contents={version.contents} />
          </SidebarContent>
        </Sidebar>
        <Main>
          <Header>
            <Search />
            <Nav>
              <NavItem>Platform</NavItem>
              <NavItem className="active">Tutorial</NavItem>
            </Nav>
          </Header>
          <MainContent>
            <div dangerouslySetInnerHTML={{__html: html}} />
            <Contents>
              <ul>
                {headings.map(heading => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ul>
            </Contents>
          </MainContent>
        </Main>
      </Container>
    </Layout>
  );
}

Docs.propTypes = {
  pageContext: PropTypes.object.isRequired
};
