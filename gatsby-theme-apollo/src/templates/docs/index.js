import Helmet from 'react-helmet';
import Layout from '../../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import Search from './search';
import SidebarNav from './sidebar-nav';
import VersionSelect from './version-select';
import colors from '../../util/colors';
import styled from '@emotion/styled';
import {FaGithub, FaSlack} from 'react-icons/fa';
import {Link} from 'gatsby';
import {ReactComponent as LogoSmall} from '../../assets/logo-small.svg';

const Container = styled.div({
  display: 'flex',
  flexGrow: 1
});

const headerHeight = 64;
const Header = styled.header({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  height: headerHeight,
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

const StyledLogoSmall = styled(LogoSmall)({
  marginRight: 8,
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
  display: 'flex',
  alignItems: 'flex-start',
  padding: '40px 64px'
});

const Contents = styled.aside({
  flexShrink: 0,
  width: 200,
  marginLeft: 40,
  position: 'sticky',
  top: headerHeight
});

const ContentsLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 12,
  fontWeight: 600,
  color: 'inherit',
  textDecoration: 'none',
  svg: {
    width: 20,
    height: 20,
    marginRight: 4,
    fill: colors.textSecondary
  }
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
            <StyledLogoSmall />
            Apollo Docs
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
              <h5>In this section</h5>
              <ul>
                {headings.map(heading => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ul>
              <ContentsLink>
                <FaGithub /> Edit on GitHub
              </ContentsLink>
              <ContentsLink>
                <FaSlack /> Discuss on Slack
              </ContentsLink>
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
