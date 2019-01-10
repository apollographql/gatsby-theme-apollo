import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {navigate} from 'gatsby';

export default class VersionSelect extends Component {
  static propTypes = {
    versions: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired
  };

  onVersionChange = event => navigate(event.target.value);

  render() {
    return (
      <select value={this.props.value} onChange={this.onVersionChange}>
        {this.props.versions.map(version => (
          <option key={version.id} value={version.basePath}>
            Version {version.majorMinor}
          </option>
        ))}
      </select>
    );
  }
}
