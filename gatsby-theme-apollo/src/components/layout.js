import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import styled from 'react-emotion';
import {Link, StaticQuery, graphql} from 'gatsby';
import {ReactComponent as Logo} from '../assets/logo.svg';

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

const Sidebar = styled.aside({
  width: 240,
  backgroundColor: 'lightgrey',
  float: 'left'
});

const SidebarLink = styled(Link)(props => ({
  display: 'block',
  paddingLeft: props.inset ? 8 : 0
}));

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
                    relativePath
                  }
                }
                headings {
                  depth
                  value
                }
              }
            }
          }
        }
      `}
      render={data => {
        const {title} = data.site.siteMetadata;
        console.log(data);
        return (
          <Fragment>
            <Helmet defaultTitle={title} titleTemplate={`%s · ${title}`}>
              <link rel="shortcut icon" src="/favicon.ico" />
            </Helmet>
            <Header>
              <StyledLogo />
            </Header>
            <Sidebar>
              {data.allMdx.edges.flatMap(edge =>
                edge.node.headings
                  .filter(heading => heading.depth < 3)
                  .map((heading, index) => (
                    <SidebarLink
                      to={edge.node.parent.name}
                      key={`${edge.node.id}-${index}`}
                      inset={heading.depth > 1}
                    >
                      {heading.value}
                    </SidebarLink>
                  ))
              )}
            </Sidebar>
            <main>{props.children}</main>
          </Fragment>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
