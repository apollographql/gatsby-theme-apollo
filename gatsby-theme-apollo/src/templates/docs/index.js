import Helmet from 'react-helmet';
import Layout from '../../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import SidebarNav from './sidebar-nav';
import VersionSelect from './version-select';
import styled from '@emotion/styled';

const Content = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Sidebar = styled.aside({
  flexShrink: 0,
  width: 240,
  backgroundColor: 'lightgrey',
  overflowY: 'auto'
});

const Main = styled.main({
  display: 'flex',
  flexGrow: 1,
  overflow: 'auto'
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
      <Content>
        <Sidebar>
          <VersionSelect versions={versions} value={version.basePath} />
          <SidebarNav contents={version.contents} />
        </Sidebar>
        <Main>
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
        </Main>
      </Content>
      {props.children}
    </Layout>
  );
}

Docs.propTypes = {
  children: PropTypes.node,
  pageContext: PropTypes.object.isRequired
};
