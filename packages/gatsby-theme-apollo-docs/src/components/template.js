import CodeBlock from './code-block';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import PageContent from './page-content';
import PageHeader from './page-header';
import PropTypes from 'prop-types';
import React, {Fragment, createContext, useContext} from 'react';
import SEO from './seo';
import rehypeReact from 'rehype-react';
import styled from '@emotion/styled';
import {ContentWrapper} from 'gatsby-theme-apollo-core';
import {Helmet} from 'react-helmet';
import {MDXProvider} from '@mdx-js/react';
import {TypescriptApiBoxContext} from './typescript-api-box';
import {graphql, navigate} from 'gatsby';

const StyledContentWrapper = styled(ContentWrapper)({
  paddingBottom: 0
});

const CustomLinkContext = createContext();

function CustomLink(props) {
  const {pathPrefix, baseUrl} = useContext(CustomLinkContext);

  const linkProps = {...props};
  if (props.href) {
    if (props.href.startsWith('/')) {
      linkProps.onClick = function handleClick(event) {
        const href = event.target.getAttribute('href');
        if (href.startsWith('/')) {
          event.preventDefault();
          navigate(href.replace(pathPrefix, ''));
        }
      };
    } else if (!props.href.startsWith('#') && !props.href.startsWith(baseUrl)) {
      linkProps.target = '_blank';
      linkProps.rel = 'noopener noreferrer';
    }
  }

  return <a {...linkProps} />;
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
  const {frontmatter, headings, fields} =
    file.childMarkdownRemark || file.childMdx;
  const {title, description, twitterHandle} = site.siteMetadata;
  const {
    sidebarContents,
    githubUrl,
    spectrumUrl,
    typescriptApiBox,
    baseUrl
  } = props.pageContext;

  const pages = sidebarContents
    .reduce((acc, {pages}) => acc.concat(pages), [])
    .filter(page => !page.anchor);

  return (
    <Fragment>
      <Helmet>
        <title>{frontmatter.title}</title>
      </Helmet>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description || description}
        siteName={title}
        twitterHandle={twitterHandle}
        baseUrl={baseUrl}
        image={fields.image}
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
          spectrumUrl={spectrumUrl}
        >
          <CustomLinkContext.Provider
            value={{
              pathPrefix: site.pathPrefix,
              baseUrl
            }}
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
          </CustomLinkContext.Provider>
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
      pathPrefix
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
        fields {
          image
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
        fields {
          image
        }
        body
      }
    }
  }
`;
