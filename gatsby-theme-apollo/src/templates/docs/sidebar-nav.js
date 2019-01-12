import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';
import styled from '@emotion/styled';
import {Link} from 'gatsby';

const StyledList = styled.ul({
  marginLeft: 0,
  listStyle: 'none'
});

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none'
});

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
      <StyledList>
        {pages.map(page => (
          <li key={page.path}>
            <StyledLink to={page.path}>{page.frontmatter.title}</StyledLink>
          </li>
        ))}
      </StyledList>
    );
  }

  render() {
    const {root, ...directories} = groupBy(this.props.contents, content => {
      const segments = content.path
        .split('/')
        .filter(Boolean)
        .filter(segment => !/v\d+/.test(segment));
      if (segments.length > 1) {
        const directory = segments[0];
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
