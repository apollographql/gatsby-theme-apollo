import NavItem from './nav-item';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {breakpoints} from 'gatsby-theme-apollo-core';
import {formatValue} from '../../utils';

const Container = styled.nav({
  display: 'flex',
  alignSelf: 'stretch',
  marginLeft: 'auto',
  paddingLeft: 40,
  [breakpoints.sm]: {
    display: 'none'
  }
});

export default function Nav(props) {
  return (
    <Container>
      {props.items.map(({value, text, matchRegex, subpages}) => {
        let isActive = matchRegex
          ? new RegExp(matchRegex).test(props.pathname)
          : props.isPathActive(value);
        if (!isActive && subpages) {
          isActive = subpages.some(subpage =>
            props.isPathActive(subpage.value)
          );
        }

        return (
          <NavItem
            key={value}
            href={formatValue(props.baseUrl, value)}
            subpages={subpages}
            active={isActive}
          >
            {text}
          </NavItem>
        );
      })}
    </Container>
  );
}

Nav.propTypes = {
  items: PropTypes.array.isRequired,
  baseUrl: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  isPathActive: PropTypes.func.isRequired
};
