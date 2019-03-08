/* global Prism */
import 'prismjs';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-jsx';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism.css';
import PropTypes from 'prop-types';
import React, {Component, Fragment, createElement} from 'react';
import autolinkHeadings from 'rehype-autolink-headings';
import codeToHast from '../util/code-to-hast';
import findHeadings from '../util/find-headings';
import mapProps from 'recompose/mapProps';
import nest from 'recompose/nest';
import path from 'path';
import raw from 'rehype-raw';
import react from 'rehype-react';
import rehype from 'remark-rehype';
import remark from 'remark';
import sanitize from 'rehype-sanitize';
import slug from 'rehype-slug';
import styled from '@emotion/styled';
import {FaGithub} from 'react-icons/fa';
import {ReactComponent as SpectrumLogo} from '../assets/logos/spectrum.svg';
import {
  breakpoints,
  codeBlockStyles,
  colors,
  headerHeight
} from 'gatsby-theme-apollo';

const Container = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  maxWidth: 1300
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
  marginRight: 56,
  overflow: 'hidden',
  '[id]::before': {
    // inspired by https://css-tricks.com/hash-tag-links-padding/
    content: "''",
    display: 'block',
    marginTop: -headerHeight,
    height: headerHeight,
    visibility: 'hidden',
    pointerEvents: 'none'
  },
  'a[href]': {
    color: colors.primary,
    ':hover': {
      textDecoration: 'none'
    }
  },
  [['h2', 'h3', 'h4']]: {
    'a[href]': {
      color: 'inherit',
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'underline'
      }
    },
    ':not(:first-child)': {
      marginTop: 56
    }
  }
});

const Sidebar = styled.aside({
  flexShrink: 0,
  width: 200,
  margin: '-20px auto 0',
  paddingTop: 24,
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
  marginBottom: 48
});

const SidebarListItem = styled.li({
  listStyle: 'none',
  fontSize: '1rem',
  a: {
    color: 'inherit',
    textDecoration: 'none',
    ':hover': {
      opacity: colors.hoverOpacity
    }
  }
});

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

function createImageComponent(owner, repo, tag, filePath) {
  return mapProps(({alt, src}) => {
    const isUrl = /^(https?:)?\/\//.test(src);
    if (!isUrl) {
      const fileDir = path.dirname(filePath);
      const imagePath = path.resolve(fileDir, src);
      const urlPaths = path.join(
        'raw.githubusercontent.com',
        owner,
        repo,
        encodeURIComponent(tag),
        imagePath
      );

      return {
        alt,
        src: `https://${urlPaths}?sanitize=true`
      };
    }

    return {
      alt,
      src
    };
  })('img');
}

export default class PageContent extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    filePath: PropTypes.string.isRequired,
    version: PropTypes.object.isRequired
  };

  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    const {owner, repo, tag} = this.props.version;
    const ImageComponent = createImageComponent(
      owner,
      repo,
      tag,
      this.props.filePath
    );

    // turn the markdown into JSX and add slug ids to the headings
    const {contents} = remark()
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
          '*': ['id'],
          pre: ['className', 'data*'],
          code: ['className', 'data*'],
          img: ['src', 'alt'],
          a: ['href', 'target', 'rel']
        }
      })
      .use(react, {
        createElement,
        components: {
          img: ImageComponent
        }
      })
      .processSync(this.props.content);

    // find all of the headings within a page to generate the contents menu
    const headings = findHeadings(contents);

    return (
      <Container>
        <InnerContainer>{contents}</InnerContainer>
        <Sidebar>
          {headings.length > 0 && (
            <Fragment>
              <SidebarHeading>In this section</SidebarHeading>
              <SidebarList>
                {headings.map(heading => (
                  <SidebarListItem key={heading.id}>
                    {heading.text}
                  </SidebarListItem>
                ))}
              </SidebarList>
            </Fragment>
          )}
          <SidebarLink
            href={path.join(
              'https://github.com',
              owner,
              repo,
              'tree',
              encodeURIComponent(tag),
              this.props.filePath
            )}
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
