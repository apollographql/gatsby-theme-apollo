/* global Prism */
import 'prismjs';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism.css';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import codeToHast from '../../util/code-to-hast';
import colors from 'gatsby-theme-apollo/src/util/colors';
import findHeadings from '../../util/find-headings';
import mapProps from 'recompose/mapProps';
import nest from 'recompose/nest';
import path from 'path';
import remark from 'remark';
import remark2react from 'remark-react';
import slug from 'remark-slug';
import styled from '@emotion/styled';
import {FaGithub, FaSlack} from 'react-icons/fa';
import {breakpoints, headerHeight} from 'gatsby-theme-apollo';
import {css} from '@emotion/core';
import {transparentize} from 'polished';

const Container = styled.div({
  display: 'flex',
  alignItems: 'flex-start'
});

const codeSelector = 'code[class*="language-"]';
const preSelector = 'pre[class*="language-"]';
const codeBlockStyles = css({
  [[codeSelector, preSelector]]: {
    fontFamily: "'Source Code Pro', monospace",
    color: colors.text1
  },
  [[`:not(pre) > ${codeSelector}`, preSelector]]: {
    border: `1px solid ${colors.divider}`,
    backgroundColor: colors.background
  },
  '.line-numbers .line-numbers-rows': {
    border: 0
  },
  '.line-numbers-rows > span:before': {
    color: colors.text4
  },
  '.line-highlight': {
    background: transparentize(0.9, colors.primary)
  },
  [['.token.atrule', '.token.attr-value', '.token.keyword']]: {
    color: colors.primary
  },
  '.token.punctuation': {
    color: colors.text2
  },
  [['.token.operator', '.token.entity', '.token.url']]: {
    color: 'inherit',
    background: 'none'
  },
  [['.token.function', '.token.class-name']]: {
    color: colors.secondary
  },
  [[
    '.token.selector',
    '.token.attr-name',
    '.token.string',
    '.token.char',
    '.token.builtin',
    '.token.inserted'
  ]]: {
    color: colors.tertiary
  },
  [['.token.comment', '.token.prolog', '.token.doctype', '.token.cdata']]: {
    color: colors.text3
  }
});

const InnerContainer = styled.div(codeBlockStyles, {
  flexGrow: 1,
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
  }
});

const Sidebar = styled.aside({
  flexShrink: 0,
  width: 200,
  marginTop: -20,
  marginLeft: 40,
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

const SidebarList = styled.ul({
  marginLeft: 0
});

const SidebarListItem = styled.li({
  listStyle: 'none',
  fontSize: '1rem'
});

const SidebarListItemLink = styled.a({
  color: 'inherit',
  textDecoration: 'none'
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
    svg: {
      width: 20,
      height: 20,
      marginRight: 6,
      fill: colors.text2
    }
  })
);

function createImageComponent({repo, tag}, fileDir) {
  return mapProps(props => {
    let src = props.src;
    const isUrl = /^(https?:)?\/\//.test(src);
    if (!isUrl) {
      const imagePath = path.resolve(fileDir, src);
      src = path.join(
        `https://raw.githubusercontent.com/${repo}/${tag}`,
        imagePath
      );
    }

    return {
      alt: props.alt,
      src
    };
  })('img');
}

export default class PageContent extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    fileDir: PropTypes.string.isRequired,
    version: PropTypes.object.isRequired
  };

  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    // turn the markdown into JSX and add slug ids to the headings
    const {contents} = remark()
      .use(slug)
      .use(remark2react, {
        remarkReactComponents: {
          img: createImageComponent(this.props.version, this.props.fileDir)
        },
        sanitize: {
          clobber: [],
          attributes: {
            '*': ['id'],
            pre: ['className', 'data*'],
            code: ['className', 'data*'],
            img: ['src', 'alt'],
            a: ['href', 'target', 'rel']
          }
        },
        toHast: {
          handlers: {
            code: codeToHast
          }
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
              <h4>In this section</h4>
              <SidebarList>
                {headings.map(heading => (
                  <SidebarListItem key={heading.id}>
                    <SidebarListItemLink href={`#${heading.id}`}>
                      {heading.text}
                    </SidebarListItemLink>
                  </SidebarListItem>
                ))}
              </SidebarList>
            </Fragment>
          )}
          <SidebarLink>
            <FaGithub /> Edit on GitHub
          </SidebarLink>
          <SidebarLink>
            <FaSlack /> Discuss on Slack
          </SidebarLink>
        </Sidebar>
      </Container>
    );
  }
}
