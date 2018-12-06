import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Slugger from 'github-slugger';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';
import styled from '@emotion/styled';
import {Hits, InstantSearch, SearchBox} from 'react-instantsearch-dom';
import {Link, StaticQuery, graphql} from 'gatsby';
import {ReactComponent as Logo} from '../assets/logo.svg';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
});

const Header = styled.header({
  padding: 16,
  color: 'white',
  backgroundColor: 'blue'
});

const StyledLogo = styled(Logo)({
  display: 'block',
  height: 40,
  fill: 'currentColor'
});

const Content = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Sidebar = styled.aside({
  flexShrink: 0,
  width: 240,
  backgroundColor: 'lightgrey'
});

const Main = styled.main({
  display: 'flex',
  flexGrow: 1,
  overflow: 'auto'
});

const Headings = styled.aside({
  flexShrink: 0,
  width: 150,
  marginLeft: 'auto',
  position: 'sticky',
  top: 0
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

        const sections = groupBy(pages, page => {
          const segments = page.path.split('/').filter(Boolean);
          return segments[segments.length - 2];
        });

        const slugger = new Slugger();
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
            <Header>
              <StyledLogo />
            </Header>
            <Content>
              <Sidebar>
                <InstantSearch
                  appId="latency"
                  apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
                  indexName="bestbuy"
                >
                  <SearchBox />
                  <Hits hitComponent={({hit}) => <div>{hit.name}</div>} />
                </InstantSearch>
                {Object.keys(sections).map(key => (
                  <Fragment key={key}>
                    {key !== 'undefined' && <h6>{startCase(key)}</h6>}
                    <ul>
                      {sections[key].map(page => (
                        <li key={page.id}>
                          <Link to={page.path}>{page.frontmatter.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </Fragment>
                ))}
              </Sidebar>
              <Main>
                <div>{props.children}</div>
                {page && (
                  <Headings>
                    <h6>Contents</h6>
                    <ul>
                      {page.headings.map(({depth, value}, index) => {
                        const slug = slugger.slug(value);
                        if (depth > 3) {
                          // return null here instead of using array.filter
                          // we want the slug results to match those from remark-slug
                          return null;
                        }

                        return (
                          <li key={`${page.id}-${index}`}>
                            <a href={`#${slug}`}>{value}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </Headings>
                )}
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
