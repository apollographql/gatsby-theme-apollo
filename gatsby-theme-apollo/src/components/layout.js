import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
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
        }
      `}
      render={data => {
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
            {props.children}
          </Container>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
