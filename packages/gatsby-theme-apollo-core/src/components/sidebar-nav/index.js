import Category from './category';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from '@emotion/styled';
import {Link, withPrefix} from 'gatsby';
import {MdUnfoldLess, MdUnfoldMore} from 'react-icons/md';
import {colors} from '../../utils/colors';
import {smallCaps} from '../../utils/typography';

const StyledList = styled.ul({
  marginLeft: 0,
  listStyle: 'none'
});

const listItemStyles = {
  color: 'inherit',
  ':hover': {
    opacity: colors.hoverOpacity
  }
};

const StyledListItem = styled.li({
  fontSize: '1rem',
  a: {
    ...listItemStyles,
    textDecoration: 'none',
    '&.active': {
      color: colors.primary,
      pointerEvents: 'none'
    }
  }
});

const ExpandAll = styled.button(listItemStyles, smallCaps, {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 12,
  padding: 0,
  border: 0,
  fontSize: 12,
  lineHeight: 1,
  background: 'none',
  outline: 'none',
  cursor: 'pointer',
  svg: {
    marginLeft: -4,
    marginRight: 4
  }
});

function getId(title) {
  return withPrefix(title);
}

export default class SidebarNav extends Component {
  constructor(props) {
    super(props);

    const sidebarState = {};
    const activeCategory = props.contents.find(this.isCategorySelected);
    if (activeCategory) {
      sidebarState[getId(activeCategory.title)] = true;
    }

    this.state = {
      sidebarState
    };
  }

  static propTypes = {
    alwaysExpanded: PropTypes.bool,
    contents: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired,
    onToggleAll: PropTypes.func,
    onToggleCategory: PropTypes.func
  };

  get allExpanded() {
    return this.props.contents.every(
      ({title}) => this.state.sidebarState[getId(title)]
    );
  }

  isPageSelected = ({path}) => {
    const [prefixedPath, pathname] = [
      withPrefix(path),
      this.props.pathname
    ].map(string => string.replace(/\/$/, ''));
    return prefixedPath === pathname;
  };

  isCategorySelected = ({path, pages}) =>
    path ? this.isPageSelected({path}) : pages.some(this.isPageSelected);

  toggleCategory = title => {
    this.setState(prevState => {
      const id = getId(title);
      const expanded = !prevState.sidebarState[id];
      const sidebarState = {
        ...prevState.sidebarState,
        [id]: expanded
      };

      if (this.props.onToggleCategory) {
        this.props.onToggleCategory(title, expanded);
      }

      return {sidebarState};
    });
  };

  toggleAll = () => {
    const expanded = !this.allExpanded;
    const sidebarState = this.props.contents.reduce(
      (acc, {title}) => ({
        ...acc,
        [getId(title)]: expanded
      }),
      {}
    );

    this.setState({sidebarState});
    if (this.props.onToggleAll) {
      this.props.onToggleAll(expanded);
    }
  };

  renderPages(pages) {
    return (
      <StyledList>
        {pages.map(page => (
          <StyledListItem key={page.path}>
            {page.anchor ? (
              <a href={page.path}>{page.title}</a>
            ) : (
              <Link
                className={this.isPageSelected(page) ? 'active' : null}
                to={page.path}
              >
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
        {this.props.contents.map(({title, path, pages}, index, array) => {
          const contents = this.renderPages(pages);
          if (!title) {
            const Icon = this.allExpanded ? MdUnfoldLess : MdUnfoldMore;
            return (
              <Fragment key="root">
                {contents}
                {array.length > 2 && (
                  <ExpandAll onClick={this.toggleAll}>
                    <Icon size={18} />
                    {this.allExpanded ? 'Collapse' : 'Expand'} all
                  </ExpandAll>
                )}
              </Fragment>
            );
          }

          return (
            <Category
              key={title}
              title={title}
              path={path}
              isFirst={!index}
              expanded={Boolean(
                this.state.sidebarState[getId(title)] ||
                  this.props.alwaysExpanded
              )}
              active={this.isCategorySelected({pages, path})}
              onClick={this.props.alwaysExpanded ? null : this.toggleCategory}
            >
              {contents}
            </Category>
          );
        })}
      </Fragment>
    );
  }
}
