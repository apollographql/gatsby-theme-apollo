import Helmet from 'react-helmet';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Link, navigate} from 'gatsby';

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

export default class Docs extends Component {
  static propTypes = {
    children: PropTypes.node,
    pageContext: PropTypes.object.isRequired
  };

  onVersionChange = event => navigate(event.target.value);

  render() {
    return (
      <Layout>
        <Helmet>
          <title>{this.props.pageContext.frontmatter.title}</title>
        </Helmet>
        <Content>
          <Sidebar>
            <select
              value={this.props.pageContext.version.basePath}
              onChange={this.onVersionChange}
            >
              {this.props.pageContext.versions.map(version => (
                <option key={version.id} value={version.basePath}>
                  v{version.id} ({version.tag})
                </option>
              ))}
            </select>
            <ul>
              {this.props.pageContext.version.contents.map(content => (
                <li key={content.path}>
                  <Link to={content.path}>{content.frontmatter.title}</Link>
                </li>
              ))}
            </ul>
          </Sidebar>
          <Main>
            <div
              dangerouslySetInnerHTML={{__html: this.props.pageContext.html}}
            />
            <Contents>
              <ul>
                {this.props.pageContext.headings.map(heading => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ul>
            </Contents>
          </Main>
        </Content>
        {this.props.children}
      </Layout>
    );
  }
}
