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
          github {
            repository(owner: "apollographql", name: "apollo-server") {
              name
              refs(
                first: 100
                refPrefix: "refs/tags/"
                orderBy: {field: TAG_COMMIT_DATE, direction: DESC}
              ) {
                nodes {
                  id
                  name
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
