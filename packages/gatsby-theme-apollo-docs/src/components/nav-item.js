import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {StaticQuery, graphql} from 'gatsby';
import {colors} from 'gatsby-theme-apollo';

const StyledAnchor = styled.a({
  display: 'flex',
  alignItems: 'center',
  padding: '0 4px',
  borderBottom: '2px solid transparent',
  fontSize: 18,
  color: colors.primary,
  textDecoration: 'none',
  '&.active': {
    borderColor: colors.secondary
  },
  ':not(:last-child)': {
    marginRight: 24
  }
});

export default function NavItem(props) {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              basePath
            }
          }
        }
      `}
      render={data => (
        <StyledAnchor
          href={props.href}
          className={
            props.href === data.site.siteMetadata.basePath ? 'active' : null
          }
        >
          {props.children}
        </StyledAnchor>
      )}
    />
  );
}

NavItem.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired
};
