import React from "react"
import Layout from '../components/layout';
import {graphql} from 'gatsby';

export default props => {
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{__html: props.data.markdownRemark.html}} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`
