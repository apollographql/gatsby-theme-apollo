/* global Prism */
import 'prismjs';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/themes/prism.css';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import colors from '../../util/colors';
import detab from 'detab';
import nest from 'recompose/nest';
import querystring from 'querystring';
import remark from 'remark';
import remark2react from 'remark-react';
import slug from 'remark-slug';
import styled from '@emotion/styled';
import u from 'unist-builder';
import {FaGithub, FaSlack} from 'react-icons/fa';
import {headerHeight} from '../../components/header';

const Container = styled.div({
  display: 'flex',
  alignItems: 'flex-start'
});

const InnerContainer = styled.div({
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
  }
});

const Sidebar = styled.aside({
  flexShrink: 0,
  width: 200,
  marginTop: -20,
  marginLeft: 40,
  paddingTop: 24,
  position: 'sticky',
  top: headerHeight
});

const SidebarList = styled.ul({
  marginLeft: 0
});

const SidebarListItem = styled.li({
  listStyle: 'none'
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

function findHeadings(component) {
  return component.props.children.reduce((acc, child) => {
    if (typeof child === 'object') {
      if (/^h[1-6]$/.test(child.type)) {
        return acc.concat([
          {
            id: child.props.id,
            text: child.props.children[0]
          }
        ]);
      }

      if (child.props.children) {
        return acc.concat(findHeadings(child));
      }
    }

    return acc;
  }, []);
}

// from https://github.com/syntax-tree/mdast-util-to-hast/blob/master/lib/handlers/code.js
function codeToHast(h, node) {
  const value = node.value ? detab(node.value + '\n') : '';
  const lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
  const codeProps = {};
  const preProps = {};

  if (lang) {
    codeProps.className = ['language-' + lang];
  }

  if (node.meta) {
    const {line} = querystring.parse(node.meta);
    preProps.dataLine = line;
  }

  return h(node.position, 'pre', preProps, [
    h(node, 'code', codeProps, [u('text', value)])
  ]);
}

export default class PageContent extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired
  };

  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    // turn the markdown into JSX and add slug ids to the headings
    const processed = remark()
      // .use(line)
      .use(slug)
      .use(remark2react, {
        sanitize: {
          clobber: [],
          attributes: {
            '*': ['id'],
            pre: ['className', 'data*'],
            code: ['className', 'data*']
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
    const headings = findHeadings(processed.contents);

    return (
      <Container>
        <InnerContainer>{processed.contents}</InnerContainer>
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
