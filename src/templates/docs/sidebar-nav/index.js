import Directory from './directory';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import colors from '../../../util/colors';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';
import styled from '@emotion/styled';
import {Link} from 'gatsby';

const StyledList = styled.ul({
  marginLeft: 0,
  listStyle: 'none'
});

const StyledListItem = styled.li(props => ({
  color: props.active && colors.primary
}));

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
    contents: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired
  };

  renderPages(pages) {
    return (
      <StyledList>
        {pages.map(page => (
          <StyledListItem
            key={page.path}
            active={page.path === this.props.pathname}
          >
            <StyledLink to={page.path}>{page.frontmatter.title}</StyledLink>
          </StyledListItem>
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
        {Object.keys(directories).map(key => {
          const pages = directories[key];
          return (
            <Directory
              key={key}
              title={key}
              active={pages.some(page => page.path === this.props.pathname)}
            >
              {this.renderPages(pages)}
            </Directory>
          );
        })}
      </Fragment>
    );
  }
}
