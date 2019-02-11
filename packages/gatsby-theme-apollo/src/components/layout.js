import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {StaticQuery, graphql, withPrefix} from 'gatsby';

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
        const {title, description} = data.site.siteMetadata;
        return (
          <Fragment>
            <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`}>
              <meta name="description" content={description} />
              <link
                rel="icon"
                type="image/x-icon"
                href={withPrefix('/favicon.ico')}
              />
            </Helmet>
            {props.children}
          </Fragment>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
