import React from "react"
import {graphql} from 'gatsby';

export default ({data}) => {
  return (
    <div>{data.site.siteMetadata.title}</div>
  )
}

export const query = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
