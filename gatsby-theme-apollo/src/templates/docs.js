import Helmet from 'react-helmet';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';

export default function Docs(props) {
  return (
    <Layout path={props.pageResources.page.path}>
      <Helmet>
        <title>{props.pageContext.frontmatter.title}</title>
      </Helmet>
      {props.children}
    </Layout>
  );
}

Docs.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.object.isRequired,
  pageResources: PropTypes.object.isRequired
};
