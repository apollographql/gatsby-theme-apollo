import React from 'react';
import Template from '../components/template';
import {graphql} from 'gatsby';

export default function MarkdownRemark(props) {
  return (
    <Template
      {...props.data.markdownRemark.frontmatter}
      location={props.location}
      sidebarContents={props.pageContext.sidebarContents}
    >
      <div dangerouslySetInnerHTML={{__html: props.data.markdownRemark.html}} />
    </Template>
  );
}

export const pageQuery = graphql`
  query MarkdownRemark($id: String) {
    markdownRemark(id: {eq: $id}) {
      frontmatter {
        title
        description
      }
      html
    }
  }
`;
