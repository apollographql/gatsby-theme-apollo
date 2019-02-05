import PropTypes from 'prop-types';
import React, {Component} from 'react';
import colors from '../../util/colors';
import styled from '@emotion/styled';
import {navigate} from 'gatsby';
import {transparentize} from 'polished';

const iconSize = 24;
const horizontalPadding = 8;
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

const Select = styled.select({
  appearance: 'none',
  padding: `6px ${horizontalPadding}px`,
  paddingRight: horizontalPadding / 2 + iconSize,
  border: 0,
  fontSize: 12,
  color: 'inherit',
  outline: 'none'
});

export default class VersionSelect extends Component {
  static propTypes = {
    versions: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired
  };

  onVersionChange = event => navigate(event.target.value);

  render() {
    return (
      <Container>
        <Select value={this.props.value} onChange={this.onVersionChange}>
          {this.props.versions.map(version => (
            <option key={version.id} value={version.basePath}>
              Version {version.majorMinor}
            </option>
          ))}
        </Select>
      </Container>
    );
  }
}
