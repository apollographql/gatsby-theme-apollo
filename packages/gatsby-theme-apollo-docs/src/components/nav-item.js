import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import styled from '@emotion/styled';
import {StaticQuery, graphql} from 'gatsby';
import {colors} from 'gatsby-theme-apollo';
import {triangle} from 'polished';

const subpagesBackgroundColor = colors.divider;
const Subpages = styled.div({
  padding: '20px 24px',
  color: colors.text1,
  borderRadius: 4,
  backgroundColor: subpagesBackgroundColor,
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)'
});

const SubpagesTriangle = styled.div(
  triangle({
    pointingDirection: 'top',
    width: 16,
    height: 8,
    foregroundColor: subpagesBackgroundColor
  }),
  {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)'
  }
);

const Container = styled.div(props => ({
  marginRight: 24,
  borderBottom: `2px solid ${props.active ? colors.secondary : 'transparent'}`,
  position: 'relative',
  ':last-child': {
    marginRight: 0,
    [Subpages]: {
      left: 'auto',
      right: 0,
      transform: 'none',
      '::before': {
        left: 'auto',
        right: 8,
        transform: 'none'
      }
    }
  },
  ':not(:hover)': {
    [[Subpages, SubpagesTriangle]]: {
      display: 'none'
    }
  },
  ':hover': {
    zIndex: 1
  }
}));

const StyledAnchor = styled.a({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  padding: '0 4px',
  fontSize: 18,
  color: colors.primary,
  textDecoration: 'none'
});

const SubpageAnchor = styled.a({
  display: 'block',
  color: 'inherit',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  ':hover': {
    color: colors.divider
  },
  ':not(:last-child)': {
    marginBottom: 8
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
        <Container active={props.href === data.site.siteMetadata.basePath}>
          <StyledAnchor href={props.href}>{props.children}</StyledAnchor>
          {props.subpages && (
            <Fragment>
              <SubpagesTriangle />
              <Subpages>
                {props.subpages.map(({value, text}) => (
                  <SubpageAnchor key={value} href={value}>
                    {text}
                  </SubpageAnchor>
                ))}
              </Subpages>
            </Fragment>
          )}
        </Container>
      )}
    />
  );
}

NavItem.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  subpages: PropTypes.array
};
