import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Slugger from 'github-slugger';
import styled from 'react-emotion';
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
        }
      `}
      render={data => {
        const slugger = new Slugger();
        const {title} = data.site.siteMetadata;
        return (
          <Container>
            <Helmet defaultTitle={title} titleTemplate={`%s · ${title}`}>
              <link rel="shortcut icon" src="/favicon.ico" />
            </Helmet>
            <Header>
              <StyledLogo />
            </Header>
            <Content>
              <Sidebar>
                <ul>
                  {data.allMdx.edges.flatMap(({node}) => (
                    <Fragment key={node.id}>
                      <li>
                        <Link to={node.parent.name}>
                          <strong>{node.frontmatter.title}</strong>
                        </Link>
                      </li>
                      {node.headings.map(({depth, value}, index) => {
                        const slug = slugger.slug(value);
                        if (depth > 3) {
                          // return null here instead of using array.filter
                          // we want the slug results to match those from remark-slug
                          return null;
                        }

                        return (
                          <li key={`${node.id}-${index}`}>
                            <Link to={`${node.parent.name}#${slug}`}>
                              {value}
                            </Link>
                          </li>
                        );
                      })}
                    </Fragment>
                  ))}
                </ul>
              </Sidebar>
              <Main>{props.children}</Main>
            </Content>
          </Container>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
