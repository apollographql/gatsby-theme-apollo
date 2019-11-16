import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import styled from '@emotion/styled';
import {IconArrowDown} from '@apollo/space-kit/icons/IconArrowDown';
import {IconArrowUp} from '@apollo/space-kit/icons/IconArrowUp';
import {Link} from 'gatsby';
import {colors} from '../../utils/colors';
import {smallCaps} from '../../utils/typography';

const iconSize = 14;
const headingStyles = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  border: 0,
  padding: '0.5em 0',
  color: colors.text2,
  background: 'none',
  outline: 'none',
  h6: {
    margin: 0,
    fontWeight: 'bold',
    ...smallCaps,
    color: 'inherit'
  },
  svg: {
    display: 'block',
    width: iconSize,
    height: iconSize,
    marginLeft: 'auto',
    fill: 'currentColor'
  },
  '&.active': {
    color: colors.primary
  }
};

const StyledButton = styled.button(headingStyles, {
  ':not([disabled])': {
    cursor: 'pointer',
    ':hover': {
      opacity: colors.hoverOpacity
    }
  }
});

const StyledLink = styled(Link)(headingStyles, {
  textDecoration: 'none'
});

export default function Category(props) {
  const Icon = props.expanded ? IconArrowUp : IconArrowDown;
  const contents = (
    <Fragment>
      <h6>{props.title}</h6>
      <Icon
        style={{
          visibility: props.onClick ? 'visible' : 'hidden'
        }}
      />
    </Fragment>
  );

  const className = props.active && 'active';
  return (
    <div>
      {!props.onClick && props.path ? (
        <StyledLink className={className} to={props.path}>
          {contents}
        </StyledLink>
      ) : (
        <StyledButton
          className={className}
          onClick={props.onClick ? () => props.onClick(props.title) : null}
        >
          {contents}
        </StyledButton>
      )}
      {props.expanded && props.children}
    </div>
  );
}

Category.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string,
  expanded: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};
