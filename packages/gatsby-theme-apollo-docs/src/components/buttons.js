import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {colors} from 'gatsby-theme-apollo';
import {darken, transparentize} from 'polished';

export const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  maxWidth: 640,
  margin: '0 auto',
  marginBottom: 24
});

function getButtonShadow(state) {
  const isFocused = state === 'focused';
  return [
    state === 'active'
      ? `inset 0 2px 2px 0 ${transparentize(0.88, colors.shadow)}`
      : `0 1px 4px 0 ${transparentize(0.92, colors.shadow)}`,
    `inset 0 -1px 0 0 ${transparentize(0.95, colors.shadow)}`,
    isFocused && `0 0 0 2px ${colors.highlight2}`,
    `inset 0 0 0 1px ${
      isFocused ? colors.highlight : transparentize(0.8, colors.shadow)
    }`
  ]
    .filter(Boolean)
    .toString();
}

const baseButtonStyles = {
  border: 'none',
  borderRadius: 4,
  boxShadow: getButtonShadow(),
  lineHeight: 'calc(1em + 1px)',
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: colors.text1,
  backgroundColor: colors.background2,
  outline: 'none',
  cursor: 'pointer',
  ':not(:active):hover': {
    backgroundColor: darken(0.05, colors.background2)
  },
  ':active': {
    boxShadow: getButtonShadow('active')
  },
  ':focus': {
    boxShadow: getButtonShadow('focused')
  }
};

function getStylesForSize(size) {
  switch (size) {
    case 'large':
      return {
        minWidth: 112,
        padding: '12px 24px',
        fontSize: 17
      };
    case 'small':
      return {
        minWidth: 76,
        padding: '7px 16px',
        fontSize: 13
      };
    default:
      return {
        minWidth: 100,
        padding: '10px 20px',
        fontSize: 15
      };
  }
}

function getColors(color) {
  const isBranded = color === 'branded';
  return {
    color: isBranded ? 'white' : colors.text1,
    backgroundColor: isBranded ? colors.primary : colors.background2
  };
}

function getButtonStyles(props) {
  const {color, backgroundColor} = getColors(props.color);
  return {
    ...baseButtonStyles,
    ...getStylesForSize(props.size),
    color,
    backgroundColor,
    ':not(:active):hover': {
      backgroundColor: darken(0.05, backgroundColor)
    }
  };
}

export const Button = styled.button(getButtonStyles);

Button.propTypes = {
  size: PropTypes.oneOf(['default', 'small', 'large']),
  color: PropTypes.oneOf(['default', 'branded'])
};

Button.defaultProps = {
  size: 'default',
  color: 'default'
};

export const ButtonLink = styled(Link)(getButtonStyles, {
  textDecoration: 'none'
});

ButtonLink.propTypes = Button.propTypes;
ButtonLink.defaultProps = Button.defaultProps;
