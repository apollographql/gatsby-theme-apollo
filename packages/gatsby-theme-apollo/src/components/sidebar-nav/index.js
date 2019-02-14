import Category from './category';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import colors from '../../util/colors';
import styled from '@emotion/styled';
import {Link} from 'gatsby';

const StyledList = styled.ul({
  marginLeft: 0,
  listStyle: 'none'
});

const StyledListItem = styled.li({
  fontSize: '1rem',
  a: {
    color: 'inherit',
    textDecoration: 'none'
  }
});

export default class SidebarNav extends Component {
  static propTypes = {
    alwaysExpanded: PropTypes.bool,
    contents: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired
  };

  renderPages(pages, key) {
    return (
      <StyledList key={key}>
        {pages.map(page => (
          <StyledListItem key={page.path}>
            {page.link ? (
              <a href={page.path}>{page.title}</a>
            ) : (
              <Link activeStyle={{color: colors.primary}} to={page.path}>
                {page.title}
              </Link>
            )}
          </StyledListItem>
        ))}
      </StyledList>
    );
  }

  render() {
    return (
      <Fragment>
        {this.props.contents.map(({title, path, pages}) => {
          const contents = this.renderPages(pages, title);
          if (!title) {
            return contents;
          }

          return (
            <Category
              key={title}
              title={title}
              path={path}
              active={pages.some(page => page.path === this.props.pathname)}
              alwaysExpanded={this.props.alwaysExpanded}
            >
              {contents}
            </Category>
          );
        })}
      </Fragment>
    );
  }
}
