import CodeBlock from './code-block';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import PageContent from './page-content';
import PageHeader from './page-header';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import SEO from './seo';
import rehypeReact from 'rehype-react';
import styled from '@emotion/styled';
import {ContentWrapper} from 'gatsby-theme-apollo-core';
import {Link, graphql} from 'gatsby';
import {MDXProvider} from '@mdx-js/react';
import {TypescriptApiBoxContext} from './typescript-api-box';

const StyledContentWrapper = styled(ContentWrapper)({
  paddingBottom: 0
});

function CustomLink({href, ...props}) {
  return href && href.startsWith('/') ? (
    <Link to={href} {...props} />
  ) : (
    <a href={href} {...props} />
  );
}

CustomLink.propTypes = {
  href: PropTypes.string
};

const components = {
  pre: CodeBlock,
  a: CustomLink
};

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components
}).Compiler;

export default function Template(props) {
  const {hash, pathname} = props.location;
  const {file, site} = props.data;
  const {frontmatter, headings} = file.childMarkdownRemark || file.childMdx;
  const {title, description, twitterHandle} = site.siteMetadata;
  const {
    sidebarContents,
    githubUrl,
    spectrumPath,
    typescriptApiBox,
    baseUrl
  } = props.pageContext;

  const pages = sidebarContents
    .reduce((acc, {pages}) => acc.concat(pages), [])
    .filter(page => !page.anchor);

  return (
    <Fragment>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description || description}
        siteName={title}
        twitterHandle={twitterHandle}
        baseUrl={baseUrl}
      />
      <StyledContentWrapper>
        <PageHeader {...frontmatter} />
        <hr />
        <PageContent
          title={frontmatter.title}
          pathname={pathname}
          pages={pages}
          headings={headings}
          hash={hash}
          githubUrl={githubUrl}
          spectrumPath={spectrumPath}
        >
          {file.childMdx ? (
            <TypescriptApiBoxContext.Provider value={typescriptApiBox}>
              <MDXProvider components={components}>
                <MDXRenderer>{file.childMdx.body}</MDXRenderer>
              </MDXProvider>
            </TypescriptApiBoxContext.Provider>
          ) : (
            renderAst(file.childMarkdownRemark.htmlAst)
          )}
        </PageContent>
      </StyledContentWrapper>
    </Fragment>
  );
}

Template.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query PageQuery($id: String) {
    site {
      siteMetadata {
        title
        description
        twitterHandle
      }
    }
    file(id: {eq: $id}) {
      childMarkdownRemark {
        frontmatter {
          title
          description
        }
        headings(depth: h2) {
          value
        }
        htmlAst
      }
      childMdx {
        frontmatter {
          title
          description
        }
        headings(depth: h2) {
          value
        }
        body
      }
    }
  }
`;
