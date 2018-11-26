import React from 'react';
import Layout from '../components/layout';

export default props => {
  return (
    <Layout>
      {props.children}
    </Layout>
  )
}
