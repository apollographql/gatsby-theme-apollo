import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import {navigate} from 'gatsby';

const Select = styled.select({
  fontSize: 12
});

export default class VersionSelect extends Component {
  static propTypes = {
    versions: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired
  };

  onVersionChange = event => navigate(event.target.value);

  render() {
    return (
      <Select value={this.props.value} onChange={this.onVersionChange}>
        {this.props.versions.map(version => (
          <option key={version.id} value={version.basePath}>
            Version {version.majorMinor}
          </option>
        ))}
      </Select>
    );
  }
}
