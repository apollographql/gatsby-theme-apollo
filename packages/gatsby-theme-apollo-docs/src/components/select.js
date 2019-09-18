import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {IconArrowDown} from '@apollo/space-kit/icons/IconArrowDown';
import {getButtonStyles} from './buttons';
import {size} from 'polished';

const Container = styled.div(props => {
  const {fontSize, color} = getButtonStyles(props);
  return {
    fontSize,
    color,
    position: 'relative'
  };
});

const StyledSelect = styled.select(getButtonStyles, {
  paddingRight: 'calc(1.5em + 0.5em * 2)',
  appearance: 'none',
  fontSize: 'inherit'
});

export const iconStyles = {
  pointerEvents: 'none',
  position: 'absolute',
  top: '50%',
  right: '0.75em',
  transform: 'translateY(-50%)'
};

const StyledIcon = styled(IconArrowDown)(size('1em'), iconStyles);

export function Select({className, style, ...props}) {
  return (
    <Container
      className={className}
      style={style}
      size={props.size}
      variant={props.variant}
      color={props.color}
    >
      <StyledSelect {...props} />
      <StyledIcon />
    </Container>
  );
}

Select.propTypes = {
  size: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};
