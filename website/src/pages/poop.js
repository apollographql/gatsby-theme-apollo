import React from 'react';
import {StaticQuery, graphql} from 'gatsby';

export default function Poop(props) {
  return <StaticQuery
    query={graphql`
        {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
    render={data => data.site.siteMetadata.title}
  />
}
