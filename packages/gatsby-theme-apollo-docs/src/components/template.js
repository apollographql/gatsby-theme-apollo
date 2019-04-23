import '../styles/gatsby-prism.css';
import '../styles/prism-theme.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import NavItem from './nav-item';
import PropTypes from 'prop-types';
import React, {PureComponent, createRef} from 'react';
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

const SidebarContentHeaderText = styled.span({
  lineHeight: 1.5
});

const Main = styled.main({
  flexGrow: 1,
  outline: 'none',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
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

const StyledContentWrapper = styled(ContentWrapper)({
  paddingBottom: 0
});

const navConfig = {
  '/docs': {
    text: 'Platform',
    matchRegex: /^\/docs\/(intro|platform|resources|references|$)/
  },
  '/docs/tutorial/introduction': {
    text: 'Tutorial',
    matchRegex: /^\/docs\/tutorial/
  },
  '/docs/react': {
    text: 'Client',
    subpages: {
      '/docs/react': 'React + React Native',
      '/docs/angular': 'Angular',
      'https://github.com/akryum/vue-apollo': 'Vue.js',
      '/docs/link': 'Apollo Link',
      '/docs/ios': 'Native iOS',
      '/docs/android': 'Native Android',
      '/docs/scalajs': 'Scala.js'
    }
  },
  '/docs/apollo-server': {
    text: 'Server',
    subpages: {
      '/docs/apollo-server': 'Apollo Server',
      '/docs/graphql-tools': 'graphql-tools',
      '/docs/graphql-tools/schema-stitching': 'Schema stitching',
      '/docs/graphql-subscriptions': 'GraphQL subscriptions'
    }
  },
  '/docs/community': {
    text: 'Community',
    subpages: {
      'https://blog.apollographql.com': 'Blog',
      'https://spectrum.chat/apollo': 'Spectrum',
      'https://twitter.com/apollographql': 'Twitter',
      'https://youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw': 'YouTube',
      '/docs/community': 'Contribute',
      'https://summit.graphql.com': 'GraphQL Summit',
      'https://graphql.com': 'Explore GraphQL'
    }
  }
};

function generateSubpage([value, text]) {
  return {
    value,
    text
  };
}

function generateNavOptions(config) {
  return Object.entries(config).map(
    ([value, {text, matchRegex, subpages}]) => ({
      value,
      text,
      matchRegex,
      subpages: subpages && Object.entries(subpages).map(generateSubpage)
    })
  );
}

const navOptions = generateNavOptions(navConfig);

export default class Template extends PureComponent {
  static propTypes = {
    pageContext: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  main = createRef();

  state = {
    activeHeading: null,
    headingOffsets: []
  };

  imagesLoaded = 0;

  get contents() {
    return this.main.current.querySelector('.content-wrapper');
  }

  get images() {
    return this.contents.querySelectorAll('img');
  }

  componentDidMount() {
    const hash = this.props.location.hash.slice(1);
    const hashElement = document.getElementById(hash);
    if (hashElement) {
      hashElement.scrollIntoView();
    }

    if (this.images.length) {
      this.images.forEach(image => {
        image.addEventListener('load', this.onImageLoad);
      });
    } else {
      this.onResize();
    }

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    this.images.forEach(image => {
      image.removeEventListener('load', this.onImageLoad);
    });
  }

  onImageLoad = () => {
    this.imagesLoaded += 1;
    if (this.imagesLoaded === this.images.length) {
      this.onResize();
    }
  };

  onResize = () => {
    const headings = this.contents.querySelectorAll('h1, h2');
    this.setState({
      headingOffsets: Array.from(headings)
        .map(heading => {
          const anchor = heading.querySelector('a');
          if (!anchor) {
            return null;
          }

          return {
            id: heading.id,
            offset: anchor.offsetTop
          };
        })
        .filter(Boolean)
    });
  };

  onScroll = event => {
    const windowOffset = window.innerHeight / 2;
    const scrollTop = event.currentTarget.scrollTop + windowOffset;
    const {headingOffsets} = this.state;
    for (let i = headingOffsets.length - 1; i >= 0; i--) {
      const heading = headingOffsets[i];
      if (scrollTop >= heading.offset) {
        this.setState({
          activeHeading: heading.id
        });
        return;
      }
    }

    this.setState({
      activeHeading: null
    });
  };

  isPathActive = value => !this.props.location.pathname.indexOf(value);

  render() {
    const {pathname} = this.props.location;
    return (
      <StaticQuery
        query={graphql`
          {
            site {
              siteMetadata {
                title
                description
                subtitle
                spectrumPath
              }
            }
          }
        `}
        render={data => {
          const {title, description, subtitle} = data.site.siteMetadata;
          return (
            <Layout>
              <SEO
                title={this.props.title}
                description={this.props.description || description}
                siteName={title}
              />
              <ResponsiveSidebar>
                {({sidebarRef, onWrapperClick, openSidebar, sidebarOpen}) => (
                  <FlexWrapper onClick={onWrapperClick}>
                    <Sidebar
                      responsive
                      open={sidebarOpen}
                      ref={sidebarRef}
                      title={title}
                    >
                      <div className="sidebar">
                        <SidebarContentHeader>
                          <SidebarContentHeaderText className="title-sidebar">
                            {subtitle}
                          </SidebarContentHeaderText>
                          {/* {versions.length > 1 && (
                            <SelectLink
                              useLink
                              isPathActive={this.isPathActive}
                              options={versions.map(({id, basePath}) => ({
                                text: `Version ${id}`,
                                value: basePath
                              }))}
                            />
                          )} */}
                        </SidebarContentHeader>
                        <SidebarNav
                          contents={this.props.sidebarContents}
                          pathname={pathname}
                        />
                      </div>
                    </Sidebar>
                    <Main ref={this.main} onScroll={this.onScroll} tabIndex={0}>
                      <div>
                        <MobileHeader>
                          <MenuButton onClick={openSidebar} />
                          <StyledLogoTitle />
                          <SelectLink
                            large
                            options={navOptions}
                            isPathActive={this.isPathActive}
                          />
                        </MobileHeader>
                        <DesktopHeader>
                          <Search />
                          <Nav>
                            {navOptions.map(
                              ({value, text, matchRegex, subpages}) => {
                                let isActive = matchRegex
                                  ? matchRegex.test(pathname)
                                  : this.isPathActive(value);
                                if (!isActive && subpages) {
                                  isActive = subpages.some(subpage =>
                                    this.isPathActive(subpage.value)
                                  );
                                }

                                return (
                                  <NavItem
                                    key={value}
                                    href={value}
                                    subpages={subpages}
                                    active={isActive}
                                  >
                                    {text}
                                  </NavItem>
                                );
                              }
                            )}
                          </Nav>
                        </DesktopHeader>
                        <StyledContentWrapper>
                          <div className="header-wrapper">
                            <MainHeading>{this.props.title}</MainHeading>
                            {this.props.description && (
                              <MainSubheading>
                                {this.props.description}
                              </MainSubheading>
                            )}
                          </div>
                          <hr />
                          <div className="content-wrapper">
                            {this.props.children}
                          </div>
                          {/* <PageContent
                            jsx={jsx}
                            content={content}
                            filePath={filePath}
                            version={version}
                            docs={docs}
                            pathname={pathname}
                            typescriptApiBox={typescriptApiBox}
                            activeHeading={this.state.activeHeading}
                          /> */}
                        </StyledContentWrapper>
                      </div>
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
}
