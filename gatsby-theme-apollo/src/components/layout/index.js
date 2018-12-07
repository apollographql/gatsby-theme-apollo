import Header from './header';
import Headings from './headings';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import Sidebar from './sidebar';
import styled from '@emotion/styled';
import {StaticQuery, graphql} from 'gatsby';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
});

const Content = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Main = styled.main({
  display: 'flex',
  flexGrow: 1,
  overflow: 'auto'
});

export default function Layout(props) {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
            }
          }
          allMdx {
            edges {
              node {
                id
                parent {
                  ... on File {
                    name
                    absolutePath
                  }
                }
                headings {
                  depth
                  value
                }
                frontmatter {
                  title
                }
              }
            }
          }
          allSitePage {
            edges {
              node {
                path
                component
              }
            }
          }
        }
      `}
      render={data => {
        const paths = new Map(
          data.allSitePage.edges.map(({node}) => [node.component, node.path])
        );

        const pages = data.allMdx.edges.map(({node}) => ({
          ...node,
          path: paths.get(node.parent.absolutePath)
        }));

        const page = pages.find(({path}) => props.path === path);
        const {title} = data.site.siteMetadata;
        return (
          <Container>
            <Helmet defaultTitle={title} titleTemplate={`%s · ${title}`}>
              <link rel="shortcut icon" src="/favicon.ico" />
              <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.0.0/themes/reset-min.css"
              />
            </Helmet>
            <Header />
            <Content>
              <Sidebar pages={pages} />
              <Main>
                <div>{props.children}</div>
                {page && <Headings page={page} />}
              </Main>
            </Content>
          </Container>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired
};
