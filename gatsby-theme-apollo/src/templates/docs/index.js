// import Headings from './headings';
import Helmet from 'react-helmet';
import Layout from '../../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const Content = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Sidebar = styled.aside({
  flexShrink: 0,
  width: 240,
  backgroundColor: 'lightgrey',
  overflowY: 'auto'
});

const Main = styled.main({
  display: 'flex',
  flexGrow: 1,
  overflow: 'auto'
});

// allMdx {
//   edges {
//     node {
//       id
//       parent {
//                   ...on File {
//           name
//           absolutePath
//         }
//       }
//       headings {
//         depth
//         value
//       }
//       frontmatter {
//         title
//       }
//     }
//   }
// }
// allSitePage {
//   edges {
//     node {
//       path
//       component
//     }
//   }
// }

export default function Docs(props) {
  // const paths = new Map(
  //   data.allSitePage.edges.map(({ node }) => [node.component, node.path])
  // );

  // const pages = data.allMdx.edges.map(({ node }) => ({
  //   ...node,
  //   path: paths.get(node.parent.absolutePath)
  // }));

  // const page = pages.find(({ path }) => props.path === path);
  console.log(props.pageContext.contents);
  return (
    <Layout path={props.pageResources.page.path}>
      <Helmet>
        <title>{props.pageContext.title}</title>
      </Helmet>
      <Content>
        <Sidebar>
          <select>
            {props.pageContext.tags.map(tag => (
              <option key={tag.id}>{tag.name}</option>
            ))}
          </select>
        </Sidebar>
        <Main>
          <div>{props.children}</div>
          {/* {page && <Headings page={page} />} */}
        </Main>
      </Content>
      {props.children}
    </Layout>
  );
}

Docs.propTypes = {
  children: PropTypes.node,
  pageContext: PropTypes.object.isRequired,
  pageResources: PropTypes.object.isRequired
};
