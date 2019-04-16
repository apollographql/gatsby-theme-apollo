/* global Prism */
import '../styles/api.less';
import 'prismjs';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism.css';
import PropTypes from 'prop-types';
import React, {Fragment, PureComponent, createElement} from 'react';
import autolinkHeadings from 'rehype-autolink-headings';
import codeToHast from '../util/code-to-hast';
import findHeadings from '../util/find-headings';
import flatMap from 'lodash/flatMap';
import mapProps from 'recompose/mapProps';
import nest from 'recompose/nest';
import path from 'path';
import raw from 'rehype-raw';
import react from 'rehype-react';
import rehype from 'remark-rehype';
import remark from 'remark';
import removeBackticks from '../util/rehype-remove-backticks';
import sanitize from 'rehype-sanitize';
import slug from 'rehype-slug';
import styled from '@emotion/styled';
import tsapibox from '../util/remark-tsapibox';
import {FaGithub} from 'react-icons/fa';
import {
  PageNav,
  breakpoints,
  codeBlockStyles,
  colors,
  headerHeight
} from 'gatsby-theme-apollo';
import {ReactComponent as SpectrumLogo} from '../assets/logos/spectrum.svg';
import {withPrefix} from 'gatsby';

const Container = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  maxWidth: 1200
});

// TODO: replace with components in MDX
const documentationButtons = {
  '.documentation-buttons': {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    maxWidth: 640,
    margin: '0 auto 24px',
    '.btn.default': {
      padding: '12px 24px',
      border: '2px solid transparent',
      borderRadius: '3em',
      fontSize: 14,
      color: 'white',
      textTransform: 'uppercase',
      textDecoration: 'none',
      letterSpacing: '0.1em',
      textIndent: '0.1em',
      backgroundColor: colors.secondary,
      '&.hollow': {
        borderColor: colors.secondary,
        color: colors.secondary,
        backgroundColor: 'transparent'
      }
    }
  }
};

const InnerContainer = styled.div(codeBlockStyles, documentationButtons, {
  flexGrow: 1,
  maxWidth: '100ch',
  overflow: 'hidden'
});

const ContentWrapper = styled.div({
  'a[href]': {
    color: colors.primary,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  [['h2', 'h3', 'h4']]: {
    'a[href]': {
      color: 'inherit'
    },
    '&[id]::before': {
      // inspired by https://css-tricks.com/hash-tag-links-padding/
      content: "''",
      display: 'block',
      marginTop: -headerHeight,
      height: headerHeight,
      visibility: 'hidden',
      pointerEvents: 'none'
    },
    ':not(:first-child)': {
      marginTop: 56
    }
  }
});

export const sidebarWidth = 260;
const Sidebar = styled.aside({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: sidebarWidth,
  maxHeight: `calc(100vh - ${headerHeight}px)`,
  marginTop: -36,
  marginLeft: 'auto',
  padding: '40px 56px',
  paddingRight: 0,
  position: 'sticky',
  top: headerHeight,
  [breakpoints.lg]: {
    display: 'none'
  },
  [breakpoints.md]: {
    display: 'block'
  },
  [breakpoints.sm]: {
    display: 'none'
  }
});

const SidebarHeading = styled.h4({
  fontWeight: 600
});

const SidebarList = styled.ul({
  marginLeft: 0,
  marginBottom: 48,
  overflow: 'auto'
});

const SidebarListItem = styled.li(props => ({
  listStyle: 'none',
  fontSize: '1rem',
  color: props.active && colors.primary,
  a: {
    color: 'inherit',
    textDecoration: 'none',
    ':hover': {
      opacity: colors.hoverOpacity
    }
  }
}));

const SidebarLink = nest(
  styled.h5({
    display: 'flex'
  }),
  styled.a({
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
    ':hover': {
      opacity: colors.hoverOpacity
    },
    svg: {
      width: 20,
      height: 20,
      marginRight: 6,
      fill: colors.text2
    }
  })
);

function createImageComponent(owner, repo, tag, filePath, localImages) {
  return mapProps(({alt, src}) => {
    const isUrl = /^(https?:)?\/\//.test(src);
    if (!isUrl) {
      if (process.env.NODE_ENV === 'development') {
        const relativePath = path.relative('/', src);
        return {
          alt,
          src: localImages[relativePath]
        };
      }

      const fileDir = path.dirname(filePath);
      let paths = path.join(
        'raw.githubusercontent.com',
        owner,
        repo,
        encodeURIComponent(tag),
        fileDir,
        src
      );

      if (/\.svg$/.test(paths)) {
        paths += '?sanitize=true';
      }

      return {
        alt,
        src: 'https://' + paths
      };
    }

    return {
      alt,
      src
    };
  })('img');
}

export default class PageContent extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    filePath: PropTypes.string.isRequired,
    version: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    docs: PropTypes.object,
    typescriptApiBox: PropTypes.object,
    activeHeading: PropTypes.string
  };

  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    const {owner, repo, tag, basePath, localImages} = this.props.version;
    const ImageComponent = createImageComponent(
      owner,
      repo,
      tag,
      this.props.filePath,
      localImages
    );

    // turn the markdown into JSX and add slug ids to the headings
    const {contents} = remark()
      .use(tsapibox, {
        docs: this.props.docs,
        typescriptApiBox: this.props.typescriptApiBox
      })
      .use(rehype, {
        allowDangerousHTML: true,
        handlers: {
          code: codeToHast
        }
      })
      .use(raw)
      .use(slug)
      .use(autolinkHeadings, {
        behavior: 'wrap'
      })
      .use(sanitize, {
        clobber: [],
        attributes: {
          '*': ['id', 'className'],
          pre: ['data*'],
          code: ['data*'],
          img: ['src', 'alt'],
          a: ['href', 'target', 'rel']
        }
      })
      .use(removeBackticks)
      .use(react, {
        createElement,
        components: {
          img: ImageComponent
        }
      })
      .processSync(this.props.content);

    // find all of the headings within a page to generate the contents menu
    const headings = findHeadings(contents);

    const pages = flatMap(this.props.version.contents, 'pages').filter(
      page => !page.anchor
    );
    const pageIndex = pages.findIndex(page => {
      const prefixedPath = withPrefix(page.path);
      return (
        prefixedPath === this.props.pathname ||
        prefixedPath === this.props.pathname.replace(/\/$/, '')
      );
    });

    return (
      <Container>
        <InnerContainer>
          <ContentWrapper className="content-wrapper">
            {contents}
          </ContentWrapper>
          <PageNav
            prevPage={pages[pageIndex - 1]}
            nextPage={pages[pageIndex + 1]}
          />
        </InnerContainer>
        <Sidebar>
          {headings.length > 0 && (
            <Fragment>
              <SidebarHeading>In this section</SidebarHeading>
              <SidebarList>
                {headings.map(heading => (
                  <SidebarListItem
                    key={heading.id}
                    active={heading.id === this.props.activeHeading}
                  >
                    {heading.text}
                  </SidebarListItem>
                ))}
              </SidebarList>
            </Fragment>
          )}
          <SidebarLink
            href={
              'https://' +
              path.join(
                'github.com',
                owner,
                repo,
                'tree',
                basePath === '/' ? 'master' : encodeURIComponent(tag),
                this.props.filePath
              )
            }
          >
            <FaGithub /> Edit on GitHub
          </SidebarLink>
          <SidebarLink href={`https://spectrum.chat/apollo/${repo}`}>
            <SpectrumLogo /> Discuss on Spectrum
          </SidebarLink>
        </Sidebar>
      </Container>
    );
  }
}
