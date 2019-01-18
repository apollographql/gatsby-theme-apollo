import 'instantsearch.css/themes/reset.css';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {StaticQuery, graphql} from 'gatsby';
import {cover} from 'polished';

const Container = styled.div(cover(), {
  display: 'flex',
  flexDirection: 'column'
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
