import Helmet from 'react-helmet';
import Layout from '../../components/layout';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Search from './search';
import SidebarNav from './sidebar-nav';
import VersionSelect from './version-select';
import colors from '../../util/colors';
import nest from 'recompose/nest';
import styled from '@emotion/styled';
import {FaGithub, FaSlack} from 'react-icons/fa';
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
  marginLeft: 'auto'
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
  marginBottom: 8
});

const MainSubheading = styled.h3({
  fontWeight: 400,
  color: colors.textSecondary
});

const MainContentInner = styled.div({
  display: 'flex',
  alignItems: 'flex-start'
});

const PageContent = styled.div({
  overflow: 'hidden',
  '[id]::before': {
    // inspired by https://css-tricks.com/hash-tag-links-padding/
    content: "''",
    display: 'block',
    marginTop: -headerHeight,
    height: headerHeight,
    visibility: 'hidden',
    pointerEvents: 'none'
  }
});

const Contents = styled.aside({
  flexShrink: 0,
  width: 200,
  marginTop: -20,
  marginLeft: 40,
  paddingTop: 24,
  position: 'sticky',
  top: headerHeight
});

const ContentsList = styled.ul({
  marginLeft: 0
});

const ContentsListItem = styled.li({
  listStyle: 'none'
});

const ContentsListItemLink = styled.a({
  color: 'inherit',
  textDecoration: 'none'
});

const ContentsLink = nest(
  styled.h5({
    display: 'flex'
  }),
  styled.a({
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
    svg: {
      width: 20,
      height: 20,
      marginRight: 6,
      fill: colors.textSecondary
    }
  })
);

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
            <SidebarContentHeader>
              Platform
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
              <NavItem>Platform</NavItem>
              <NavItem className="active">Tutorial</NavItem>
            </Nav>
          </Header>
          <MainContent>
            <MainHeading>Welcome</MainHeading>
            <MainSubheading>
              Start here to learn about the Apollo platform
            </MainSubheading>
            <hr />
            <MainContentInner>
              <PageContent dangerouslySetInnerHTML={{__html: html}} />
              <Contents>
                {headings.length > 0 && (
                  <Fragment>
                    <h4>In this section</h4>
                    <ContentsList>
                      {headings.map(heading => (
                        <ContentsListItem key={heading.id}>
                          <ContentsListItemLink href={`#${heading.id}`}>
                            {heading.text}
                          </ContentsListItemLink>
                        </ContentsListItem>
                      ))}
                    </ContentsList>
                  </Fragment>
                )}
                <ContentsLink>
                  <FaGithub /> Edit on GitHub
                </ContentsLink>
                <ContentsLink>
                  <FaSlack /> Discuss on Slack
                </ContentsLink>
              </Contents>
            </MainContentInner>
          </MainContent>
        </Main>
      </Container>
    </Layout>
  );
}

Docs.propTypes = {
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
