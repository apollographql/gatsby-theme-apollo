import React from 'react';
import {StaticQuery, graphql} from 'gatsby';

export default function Foo(props) {
  return <StaticQuery
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
      console.log(data);
      return data.site.siteMetadata.title;
    }}
  />
}
