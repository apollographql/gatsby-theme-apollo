import '../styles/gatsby-prism.css';
import '../styles/prism-theme.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import Nav, {navItems} from './nav';
import PageContent from './page-content';
import PageHeader from './page-header';
import PropTypes from 'prop-types';
import React, {PureComponent, createRef} from 'react';
import SEO from './seo';
import Search from './search';
import SelectLink from './select-link';
import SidebarContent from './sidebar-content';
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
  Sidebar
} from 'gatsby-theme-apollo';
import {graphql} from 'gatsby';

const StyledLogoTitle = styled(LogoTitle)({
  marginRight: 'auto'
});

const Main = styled.main({
  flexGrow: 1,
  outline: 'none',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
});

const StyledContentWrapper = styled(ContentWrapper)({
  paddingBottom: 0
});

export default class Template extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
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

  isPathActive = value => {
    return !this.props.location.pathname.indexOf(value);
  };

  render() {
    const {pathname} = this.props.location;
    const {file, site} = this.props.data;
    const {frontmatter, headings} = file.childMarkdownRemark || file.childMdx;
    const {title, description, subtitle} = site.siteMetadata;
    const {
      sidebarContents,
      githubRepo,
      spectrumPath,
      filePath
    } = this.props.pageContext;

    const [owner, repo] = githubRepo.split('/');
    return (
      <Layout>
        <SEO
          title={frontmatter.title}
          description={frontmatter.description || description}
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
                <SidebarContent
                  title={subtitle}
                  pathname={pathname}
                  contents={sidebarContents}
                />
              </Sidebar>
              <Main ref={this.main} onScroll={this.onScroll} tabIndex={0}>
                <MobileHeader>
                  <MenuButton onClick={openSidebar} />
                  <StyledLogoTitle />
                  <SelectLink
                    large
                    options={navItems}
                    isPathActive={this.isPathActive}
                  />
                </MobileHeader>
                <DesktopHeader>
                  <Search />
                  <Nav pathname={pathname} isPathActive={this.isPathActive} />
                </DesktopHeader>
                <StyledContentWrapper>
                  <PageHeader {...frontmatter} />
                  <hr />
                  <PageContent
                    owner={owner}
                    repo={repo}
                    gitRef="master"
                    pathname={pathname}
                    pages={sidebarContents
                      .reduce((acc, {pages}) => acc.concat(pages), [])
                      .filter(page => !page.anchor)}
                    headings={headings}
                    spectrumPath={spectrumPath}
                    filePath={filePath}
                    activeHeading={this.state.activeHeading}
                  >
                    {file.childMdx ? (
                      <MDXRenderer>{file.childMdx.code.body}</MDXRenderer>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: file.childMarkdownRemark.html
                        }}
                      />
                    )}
                  </PageContent>
                </StyledContentWrapper>
              </Main>
            </FlexWrapper>
          )}
        </ResponsiveSidebar>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query PageQuery($id: String) {
    site {
      siteMetadata {
        title
        description
        subtitle
      }
    }
    file(id: {eq: $id}) {
      childMarkdownRemark {
        frontmatter {
          title
          description
        }
        headings {
          value
        }
        html
      }
      childMdx {
        frontmatter {
          title
          description
        }
        headings {
          value
        }
        code {
          body
        }
      }
    }
  }
`;
