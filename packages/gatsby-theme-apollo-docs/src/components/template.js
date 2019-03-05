import NavItem from './nav-item';
import PageContent from './page-content';
import PropTypes from 'prop-types';
import React from 'react';
import SEO from './seo';
import Search from './search';
import SelectLink from './select-link';
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
import {StaticQuery, graphql} from 'gatsby';

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

const navConfig = {
  '/docs/platform': ['Platform'],
  '/docs/tutorial': ['Tutorial'],
  '/docs/apollo-client': [
    'Client',
    {
      '/docs/react': ['React + React Native'],
      '/docs/angular': ['Angular'],
      'https://github.com/akryum/vue-apollo': ['Vue.js'],
      '/docs/link': ['Apollo Link'],
      '/docs/ios': ['Native iOS'],
      '/docs/android': ['Native Android'],
      '/docs/scalajs': ['Scala.js']
    }
  ],
  '/docs/apollo-server': [
    'Server',
    {
      '/docs/apollo-server': ['Apollo Server'],
      '/docs/graphql-tools': ['graphql-tools'],
      '/docs/graphql-tools/schema-stitching': ['Schema stitching'],
      '/docs/graphql-subscriptions': ['GraphQL subscriptions']
    }
  ],
  '/docs/community': [
    'Community',
    {
      'https://blog.apollographql.com': ['Blog'],
      'https://spectrum.chat/apollo': ['Spectrum'],
      'https://twitter.com/apollographql': ['Twitter'],
      'https://youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw': ['YouTube'],
      '/docs/community': ['Contribute'],
      'https://summit.graphql.com': ['GraphQL Summit'],
      'https://graphql.com': ['Explore GraphQL']
    }
  ]
};

function generateNavOptions(config) {
  return Object.entries(config).map(([value, [text, subpages]]) => ({
    value,
    text,
    subpages: subpages && generateNavOptions(subpages)
  }));
}

const navOptions = generateNavOptions(navConfig);

export default function Template(props) {
  const {
    version,
    versions,
    title,
    description,
    content,
    filePath
  } = props.pageContext;

  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              subtitle
            }
          }
        }
      `}
      render={data => {
        const {
          title: siteName,
          description: siteDescription,
          subtitle
        } = data.site.siteMetadata;
        return (
          <Layout>
            <SEO
              title={title}
              description={description || siteDescription}
              siteName={siteName}
            />
            <ResponsiveSidebar>
              {({sidebarRef, onWrapperClick, openSidebar, sidebarOpen}) => (
                <FlexWrapper onClick={onWrapperClick}>
                  <Sidebar
                    responsive
                    open={sidebarOpen}
                    ref={sidebarRef}
                    title={siteName}
                  >
                    <SidebarContentHeader>
                      {subtitle}
                      <SelectLink
                        value={version.basePath}
                        options={versions.map(
                          ({id, basePath, semverMatch}) => ({
                            text: `Version ${id} (${semverMatch})`,
                            value: basePath
                          })
                        )}
                      />
                    </SidebarContentHeader>
                    <SidebarNav
                      contents={version.contents}
                      pathname={props.location.pathname}
                    />
                  </Sidebar>
                  <Main>
                    <MobileHeader>
                      <MenuButton onClick={openSidebar} />
                      <StyledLogoTitle />
                      <SelectLink
                        large
                        options={navOptions}
                        value={version.basePath}
                      />
                    </MobileHeader>
                    <DesktopHeader>
                      <Search />
                      <Nav>
                        {navOptions.map(({value, text, subpages}) => (
                          <NavItem key={value} href={value} subpages={subpages}>
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
      }}
    />
  );
}

Template.propTypes = {
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
