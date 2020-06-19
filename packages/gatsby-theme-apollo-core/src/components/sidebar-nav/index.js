// import Category from './category';
import PropTypes from 'prop-types';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import styled from '@emotion/styled';
import usePrevious from 'react-use/lib/usePrevious';
import {IconArrowDown} from '@apollo/space-kit/icons/IconArrowDown';
import {IconArrowUp} from '@apollo/space-kit/icons/IconArrowUp';
import {IconCollapseList} from '@apollo/space-kit/icons/IconCollapseList';
import {IconExpandList} from '@apollo/space-kit/icons/IconExpandList';
import {IconOutlink} from '@apollo/space-kit/icons/IconOutlink';
import {Link, withPrefix} from 'gatsby';
import {colors} from '../../utils/colors';
import {size} from 'polished';
import {smallCaps} from '../../utils/typography';

// const StyledList = styled.ul({
//   marginLeft: 0,
//   listStyle: 'none',
//   marginBottom: 32
// });

// const StyledListItem = styled.li({
//   fontSize: '1rem',
//   lineHeight: 1.5,
//   marginBottom: '0.8125rem',
//   a: {
//     ...hoverStyle,
//     textDecoration: 'none',
//     '&.active': {
//       color: colors.primary,
//       pointerEvents: 'none'
//     }
//   }
// });

const ExpandAll = styled.button(smallCaps, {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 12,
  padding: '4px 0',
  border: 0,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  background: 'none',
  outline: 'none',
  cursor: 'pointer',
  color: 'inherit',
  ':hover': {
    opacity: colors.hoverOpacity
  },
  svg: {
    ...size(12),
    marginRight: 8
  }
});

// function getId(title) {
//   return withPrefix(title);
// }

// function isPageSelected(path, pathname) {
//   const [a, b] = [withPrefix(path), pathname].map(string =>
//     string.replace(/\/$/, '')
//   );
//   return a === b;
// }

// function isCategorySelected({path, pages}, pathname) {
//   return path
//     ? isPageSelected(path, pathname)
//     : pages.some(page => isPageSelected(page.path, pathname));
// }

// function getSidebarState(contents, pathname) {
//   const activeCategory = contents.find(category =>
//     isCategorySelected(category, pathname)
//   );
//   if (activeCategory) {
//     return {[getId(activeCategory.title)]: true};
//   }

//   return {};
// }

const StyledList = styled.ul({
  marginLeft: 0,
  marginBottom: 32,
  listStyle: 'none'
});

const StyledListItem = styled.li({
  fontSize: '1rem',
  lineHeight: 1.5,
  marginBottom: '0.8125rem',
  a: {
    color: 'inherit',
    textDecoration: 'none',
    ':hover': {
      opacity: colors.hoverOpacity
    },
    '&.active': {
      color: colors.primary,
      pointerEvents: 'none'
    }
  }
});

const Category = styled.div({
  position: 'relative',
  zIndex: 0,
  [StyledList]: {
    position: 'relative',
    zIndex: 2
  }
});

const CategoryTitle = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75em 0',
  color: colors.text1,
  fontWeight: 'bold',
  fontSize: 14,
  lineHeight: 'normal',
  ...smallCaps,
  svg: size(10),
  '&.active': {
    color: colors.primary
  }
});

const StyledCheckbox = styled.input({
  ...size('100%'),
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0,
  zIndex: 1,
  [`:hover ~ ${CategoryTitle}`]: {
    opacity: colors.hoverOpacity
  },
  ':not(:checked) ~': {
    [`${CategoryTitle} svg`]: {
      transform: 'scaleY(-1)'
    },
    [StyledList]: {
      display: 'none'
    }
  }
});

const StyledOutlinkIcon = styled(IconOutlink)(size(14), {
  verticalAlign: -1,
  marginLeft: 8,
  color: colors.text3
});

function isPageSelected(path, pathname) {
  const [a, b] = [withPrefix(path), pathname].map(string =>
    string.replace(/\/$/, '')
  );
  return a === b;
}

function isCategorySelected(path, pages, pathname) {
  return path
    ? isPageSelected(path, pathname)
    : pages.some(page => isPageSelected(page.path, pathname));
}

export default function SidebarNav(props) {
  const allExpanded = false;
  const categories = props.contents.filter(content => content.title);
  return (
    <>
      {categories.length > 1 && (
        <ExpandAll>
          {React.createElement(allExpanded ? IconCollapseList : IconExpandList)}
          {allExpanded ? 'Collapse' : 'Expand'} all
        </ExpandAll>
      )}
      {categories.map((category, index) => {
        const isSelected = category.pages.some(page =>
          isPageSelected(page.path, props.pathname)
        );
        return (
          <Category key={index}>
            <StyledCheckbox type="checkbox" defaultChecked={isSelected} />
            <CategoryTitle className={isSelected ? 'active' : null}>
              {category.title}
              <IconArrowUp />
            </CategoryTitle>
            <StyledList>
              {category.pages.map((page, index) => {
                const pageTitle = page.sidebarTitle || page.title;
                return (
                  <StyledListItem key={index}>
                    {page.anchor ? (
                      <a
                        href={page.path}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pageTitle}
                        <StyledOutlinkIcon />
                      </a>
                    ) : (
                      <Link
                        className={
                          isPageSelected(page.path, props.pathname)
                            ? 'active'
                            : null
                        }
                        to={page.path}
                        title={page.description}
                        onClick={props.onLinkClick}
                      >
                        {pageTitle}
                      </Link>
                    )}
                  </StyledListItem>
                );
              })}
            </StyledList>
          </Category>
        );
      })}
    </>
  );
}

function SidebarNav2(props) {
  const prevPathname = usePrevious(props.pathname);
  const [state, setState] = useState(
    getSidebarState(props.contents, props.pathname)
  );

  const allExpanded = useMemo(
    () => props.contents.every(({title}) => state[getId(title)]),
    [props.contents, state]
  );

  useEffect(() => {
    if (props.pathname !== prevPathname) {
      const category = props.contents.find(({pages}) =>
        pages.find(page => isPageSelected(page.path, props.pathname))
      );
      if (category) {
        const id = getId(category.title);
        if (!state[id]) {
          setState(prevState => ({
            ...prevState,
            [id]: true
          }));
        }
      }
    }
  }, [props.contents, props.pathname, prevPathname, state, setState]);

  function toggleCategory(title) {
    setState(prevState => {
      const id = getId(title);
      const expanded = !prevState[id];

      if (props.onToggleCategory) {
        props.onToggleCategory(title, expanded);
      }

      return {
        ...prevState,
        [id]: expanded
      };
    });
  }

  function toggleAll() {
    const expanded = !allExpanded;
    setState(
      props.contents.reduce(
        (acc, {title}) => ({
          ...acc,
          [getId(title)]: expanded
        }),
        {}
      )
    );

    if (props.onToggleAll) {
      props.onToggleAll(expanded);
    }
  }

  return (
    <Fragment>
      {props.contents.map(({title, path, pages}, index, array) => {
        const contents = pages.map(page => {
          const pageTitle = page.sidebarTitle || page.title;
          return (
            <StyledListItem key={page.path}>
              {page.anchor ? (
                <a href={page.path} target="_blank" rel="noopener noreferrer">
                  {pageTitle}
                  <StyledOutlinkIcon />
                </a>
              ) : (
                <Link
                  className={
                    isPageSelected(page.path, props.pathname) ? 'active' : null
                  }
                  to={page.path}
                  title={page.description}
                  onClick={props.onLinkClick}
                >
                  {pageTitle}
                </Link>
              )}
            </StyledListItem>
          );
        });

        if (!title) {
          const Icon = allExpanded ? IconCollapseList : IconExpandList;
          return (
            <Fragment key="root">
              <StyledList>{contents}</StyledList>
              {array.length > 2 && (
                <ExpandAll onClick={toggleAll}>
                  {React.createElement(
                    allExpanded ? IconCollapseList : IconExpandList
                  )}
                  {allExpanded ? 'Collapse' : 'Expand'} all
                </ExpandAll>
              )}
            </Fragment>
          );
        }

        const isExpanded = state[getId(title)] || props.alwaysExpanded;
        return (
          <Category
            key={title}
            title={title}
            path={path}
            icon={isExpanded ? <IconArrowUp /> : <IconArrowDown />}
            active={isCategorySelected({pages, path}, props.pathname)}
            onClick={props.alwaysExpanded ? null : toggleCategory}
          >
            <StyledList
              style={{
                display: isExpanded ? 'block' : 'none'
              }}
            >
              {contents}
            </StyledList>
          </Category>
        );
      })}
    </Fragment>
  );
}

SidebarNav.propTypes = {
  alwaysExpanded: PropTypes.bool,
  contents: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  onToggleAll: PropTypes.func,
  onToggleCategory: PropTypes.func,
  onLinkClick: PropTypes.func
};
