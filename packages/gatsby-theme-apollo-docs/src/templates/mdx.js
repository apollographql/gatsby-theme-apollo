import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import PropTypes from 'prop-types';
import React from 'react';
import Template from '../components/template';
import {graphql} from 'gatsby';

export default function MDX(props) {
  return (
    <Template
      {...props.data.mdx.frontmatter}
      location={props.location}
      sidebarContents={props.pageContext.sidebarContents}
    >
      <MDXRenderer>{props.data.mdx.code.body}</MDXRenderer>
    </Template>
  );
}

MDX.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

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
