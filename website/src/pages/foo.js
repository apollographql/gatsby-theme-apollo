import React from 'react';
import {StaticQuery, graphql} from 'gatsby';

export default function Foo() {
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
        console.log(data);
        return <div>his</div>;
      }}
    />
  );
}
