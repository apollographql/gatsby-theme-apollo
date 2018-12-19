import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';
import {Link} from 'gatsby';

const directoryPattern = /^\/v\d+\/([\w-]+)\//;
const titleExceptions = {
  api: 'API',
  graphql: 'GraphQL'
};

export default class SidebarNav extends Component {
  static propTypes = {
    contents: PropTypes.array.isRequired
  };

  renderPages(pages) {
    return (
      <ul>
        {pages.map(page => (
          <li key={page.path}>
            <Link to={page.path}>{page.frontmatter.title}</Link>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const {root, ...directories} = groupBy(this.props.contents, content => {
      const match = content.path.match(directoryPattern);
      if (match) {
        const directory = match[1];
        return titleExceptions[directory] || startCase(directory);
      }

      return 'root';
    });

    return (
      <Fragment>
        {this.renderPages(root)}
        {Object.keys(directories).map(key => (
          <div key={key}>
            <h6>{key}</h6>
            {this.renderPages(directories[key])}
          </div>
        ))}
      </Fragment>
    );
  }
}
