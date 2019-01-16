import 'instantsearch.css/themes/reset.css';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import {StaticQuery, graphql} from 'gatsby';

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
          <div className="flex flex-col absolute pin">
            <Helmet defaultTitle={title} titleTemplate={`%s · ${title}`}>
              <link rel="shortcut icon" src="/favicon.ico" />
              <link
                href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/utilities.min.css"
                rel="stylesheet"
              />
            </Helmet>
            {props.children}
          </div>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
