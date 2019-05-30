import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import {colors} from 'gatsby-theme-apollo';
import {navigate, withPrefix} from 'gatsby';
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
    isPathActive: PropTypes.func.isRequired,
    large: PropTypes.bool,
    useLink: PropTypes.bool
  };

  onChange = event => {
    if (this.props.useLink) {
      navigate(event.target.value);
      return;
    }

    window.location.href = event.target.value;
  };

  render() {
    let value;
    this.props.options.forEach(option => {
      const path = this.props.useLink ? withPrefix(option.value) : option.value;
      const isActive = option.matchRegex
        ? option.matchRegex.test(path)
        : this.props.isPathActive(path);
      if (isActive) {
        value = option.value;
      }

      if (option.subpages) {
        option.subpages.forEach(subpage => {
          if (this.props.isPathActive(subpage.value)) {
            value = option.value;
          }
        });
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
