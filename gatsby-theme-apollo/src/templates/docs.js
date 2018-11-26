import React from 'react';
import Layout from '../components/layout';
import Helmet from 'react-helmet';

export default props => {
  return (
    <Layout>
      <Helmet>
        <title>{props.pageContext.frontmatter.title}</title>
      </Helmet>
      {props.children}
    </Layout>
  )
}
