import React, { Fragment, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { IconClose } from '@apollo/space-kit/icons/IconClose';
import { breakpoints, colors, smallCaps } from 'gatsby-theme-apollo-core';
import { css } from '@emotion/core';
import { position, size, transparentize } from 'polished';
import { useFlexSearch } from 'react-use-flexsearch';
import { Results } from './results';
import { graphql, useStaticQuery } from 'gatsby';

import './docsearch.css';

const HEADER_HEIGHT = 64;
const borderRadius = 5;
const border = `1px solid ${colors.text3}`;
const verticalAlign = css({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
});
const boxShadowColor = transparentize(0.9, 'black');
export const boxShadow = `${boxShadowColor} 0 2px 12px`;
const Container = styled.div({
  flexGrow: 1,
  marginRight: 40,
  color: colors.text2,
  position: 'relative',
  zIndex: 1,
  [breakpoints.md]: {
    marginRight: 0,
  },
  '.algolia-autocomplete': {
    width: '100%',
    '.ds-dropdown-menu': {
      width: '100%',
      maxWidth: '100%',
      minWidth: 'auto',
      marginTop: 14,
      borderRadius,
      boxShadow,
      '&::before': {
        display: 'none',
      },
      '[class^=ds-dataset-]': {
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px - 32px)`,
        padding: 0,
        border,
        borderRadius: 'inherit',
      },
      '.ds-suggestions': {
        marginTop: 0,
      },
      '.ds-suggestion': {
        padding: '20px 32px',
        borderBottom: `1px solid ${colors.divider}`,
        '&.ds-cursor': {
          backgroundColor: transparentize(0.5, colors.divider),
        },
      },
    },
    '.algolia-docsearch-suggestion': {
      padding: 0,
      color: 'inherit',
      background: 'none',
      textDecoration: 'none',
      [['&--wrapper', '&--subcategory-column', '&--content']]: {
        width: 'auto',
        float: 'none',
      },
      '&--wrapper': {
        paddingTop: 0,
      },
      '&--category-header': {
        marginTop: 0,
        marginBottom: 4,
        borderBottom: 0,
        fontSize: 14,
        color: 'inherit',
        ...smallCaps,
      },
      [['&--subcategory-column', '&--content']]: {
        padding: 0,
        '&::before': {
          display: 'none',
        },
      },
      '&--subcategory-column': {
        marginBottom: 4,
        fontSize: 22,
        color: colors.text1,
        textAlign: 'initial',
      },
      '&--content': {
        background: 'none !important',
      },
      '&--title': {
        marginBottom: 0,
        fontSize: 18,
        fontWeight: 'normal',
        color: 'inherit',
      },
      '&--highlight': {
        boxShadow: 'none !important',
        color: `${colors.primary} !important`,
        background: 'none !important',
      },
      '&--no-results': {
        padding: 32,
      },
    },
    '.algolia-docsearch-footer': {
      margin: 12,
    },
  },
});

const StyledInput = styled.input(props => ({
  width: '100%',
  height: 42,
  padding: 0,
  paddingLeft: 16,
  border,
  borderRadius,
  boxShadow: props.resultsShown ? boxShadow : 'none',
  fontSize: 16,
  background: 'white',
  outline: 'none',
  appearance: 'none',
}));

const Overlay = styled.div(
  position('fixed', 0),
  props =>
    !props.visible && {
      opacity: 0,
      visibility: 'hidden',
    },
  {
    backgroundColor: transparentize(0.5, colors.text2),
    transitionProperty: 'opacity, visibility',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
    zIndex: 1,
  },
);

const ResetButton = styled.button(verticalAlign, size(20), {
  padding: 0,
  border: 0,
  background: 'none',
  cursor: 'pointer',
  outline: 'none',
  color: 'inherit',
  right: 10,
});

const ResetIcon = styled(IconClose)(size(14), {
  display: 'block',
  fill: 'currentColor',
});

const useMemoArg = (fn, ...args) => useMemo(() => fn(...args), args);

export function Search(props) {
  const [value = '', setValue] = useState('');
  const input = useRef(null);
  const { localSearchPages: data, site: { siteName = '' } } = useStaticQuery(graphql`
    query {
      localSearchPages {
        index
        store
      },
      site {
        siteMetadata {
          siteName
        }
      }
    }
  `);

  const results = useFlexSearch(value, data.index, useMemoArg(JSON.parse, data.store));

  function onChange(evt) {
    setValue(evt.target.value);
  }

  function reset() {
    setValue('');
  }

  const showResults = !!value.trim() && results.length > 0;
  return (
    <Fragment>
      <Overlay visible={showResults} onClick={reset}/>
      <Container>
          <span className='algolia-autocomplete algolia-autocomplete-right'>
          <StyledInput
            ref={input}
            id="input"
            onChange={onChange}
            value={value}
            placeholder={`Search ` + siteName}
            resultsShown={showResults}
          />
            {showResults && (
              <ResetButton
                onMouseDown={(e) => e.preventDefault()}
                onClick={reset}
              >
                <ResetIcon/>
              </ResetButton>
            )}
            {showResults && <Results results={results} onClick={reset}/>}
          </span>
      </Container>
    </Fragment>
  );
}

