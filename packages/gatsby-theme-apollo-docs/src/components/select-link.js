import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import {colors} from 'gatsby-theme-apollo';
import {transparentize} from 'polished';

const iconSize = 24;
const Container = styled.div({
  color: colors.text2,
  borderRadius: 4,
  backgroundColor: transparentize(0.75, colors.divider),
  position: 'relative',
  '&::after': {
    content: "'›'",
    width: iconSize,
    fontSize: iconSize,
    lineHeight: `${iconSize}px`,
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%) rotate(90deg)',
    pointerEvents: 'none'
  }
});

const Select = styled.select(props => {
  const horizontalPadding = props.large ? 12 : 8;
  return {
    appearance: 'none',
    padding: `6px ${horizontalPadding}px`,
    paddingRight: horizontalPadding / 2 + iconSize,
    border: 0,
    fontSize: props.large ? 14 : 12,
    lineHeight: 1.25,
    color: 'inherit',
    outline: 'none'
  };
});

export default class SelectLink extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired,
    large: PropTypes.bool
  };

  onChange = event => {
    window.location.href = event.target.value;
  };

  render() {
    let value;
    this.props.options.forEach(options => {
      if (!this.props.pathname.indexOf(options.value)) {
        value = options.value;
      }
    });

    return (
      <Container>
        <Select large={this.props.large} value={value} onChange={this.onChange}>
          {this.props.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </Select>
      </Container>
    );
  }
}
