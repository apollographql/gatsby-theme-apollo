import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import React from 'react';
import Template from '../components/template';
import {graphql} from 'gatsby';

export default function MDX(props) {
  return (
    <Template location={props.location} {...props.data.mdx.frontmatter}>
      <MDXRenderer>{props.data.mdx.code.body}</MDXRenderer>
    </Template>
  );
}

export const pageQuery = graphql`
  query MDX($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        description
      }
      code {
        body
      }
    }
  }
`;
