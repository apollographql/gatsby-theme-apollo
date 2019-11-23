/* global docsearch */
import PropTypes from 'prop-types';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';
import {HEADER_HEIGHT} from './header';
import {IconClose} from '@apollo/space-kit/icons/IconClose';
import {breakpoints, colors, smallCaps} from 'gatsby-theme-apollo-core';
import {css} from '@emotion/core';
import {position, size, transparentize} from 'polished';

const borderRadius = 5;
const border = `1px solid ${colors.text3}`;
const verticalAlign = css({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)'
});

const Hotkey = styled.div(verticalAlign, size(24), {
  border,
  borderColor: colors.text4,
  color: colors.text4,
  borderRadius,
  textAlign: 'center',
  lineHeight: 1.125,
  right: 10,
  pointerEvents: 'none'
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
    marginRight: 0
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
        display: 'none'
      },
      '[class^=ds-dataset-]': {
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px - 32px)`,
        padding: 0,
        border,
        borderRadius: 'inherit'
      },
      '.ds-suggestions': {
        marginTop: 0
      },
      '.ds-suggestion': {
        padding: '20px 32px',
        borderBottom: `1px solid ${colors.divider}`,
        '&.ds-cursor': {
          backgroundColor: transparentize(0.5, colors.divider)
        }
      }
    },
    '.algolia-docsearch-suggestion': {
      padding: 0,
      color: 'inherit',
      background: 'none',
      textDecoration: 'none',
      [['&--wrapper', '&--subcategory-column', '&--content']]: {
        width: 'auto',
        float: 'none'
      },
      '&--wrapper': {
        paddingTop: 0
      },
      '&--category-header': {
        marginTop: 0,
        marginBottom: 4,
        borderBottom: 0,
        fontSize: 14,
        color: 'inherit',
        ...smallCaps
      },
      [['&--subcategory-column', '&--content']]: {
        padding: 0,
        '&::before': {
          display: 'none'
        }
      },
      '&--subcategory-column': {
        marginBottom: 4,
        fontSize: 22,
        color: colors.text1,
        textAlign: 'initial'
      },
      '&--content': {
        background: 'none !important'
      },
      '&--title': {
        marginBottom: 0,
        fontSize: 18,
        fontWeight: 'normal',
        color: 'inherit'
      },
      '&--highlight': {
        boxShadow: 'none !important',
        color: `${colors.primary} !important`,
        background: 'none !important'
      },
      '&--no-results': {
        padding: 32
      }
    },
    '.algolia-docsearch-footer': {
      margin: 12
    }
  }
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
  appearance: 'none'
}));

const Overlay = styled.div(
  position('fixed', 0),
  props =>
    !props.visible && {
      opacity: 0,
      visibility: 'hidden'
    },
  {
    backgroundColor: transparentize(0.5, colors.text2),
    transitionProperty: 'opacity, visibility',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
    zIndex: 1
  }
);

const ResetButton = styled.button(verticalAlign, size(20), {
  padding: 0,
  border: 0,
  background: 'none',
  cursor: 'pointer',
  outline: 'none',
  color: 'inherit',
  right: 10
});

const ResetIcon = styled(IconClose)(size(14), {
  display: 'block',
  fill: 'currentColor'
});

export default function Search(props) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const input = useRef(null);
  const search = useRef(null);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown, true);

    if (typeof docsearch !== 'undefined') {
      search.current = docsearch({
        apiKey: props.apiKey,
        indexName: props.indexName,
        inputSelector: '#input',
        // debug: true, // keeps the results list open
        autocompleteOptions: {
          openOnFocus: true
        },
        algoliaOptions: {
          hitsPerPage: 10
        }
      });
    }

    return () => {
      window.addEventListener('keydown', onKeyDown, true);
    };
  }, [props.apiKey, props.indexName]);

  function onKeyDown(event) {
    // focus the input when the slash key is pressed
    if (
      event.keyCode === 191 &&
      event.target.tagName.toUpperCase() !== 'INPUT'
    ) {
      event.preventDefault();
      input.current.focus();
    }
  }

  function onChange(event) {
    setValue(event.target.value);
  }

  function onFocus() {
    setFocused(true);
  }
  function onBlur() {
    setFocused(false);
  }

  function reset() {
    setValue('');
    if (search.current) {
      search.current.autocomplete.autocomplete.setVal('');
    }
  }

  const resultsShown = focused && value.trim();
  return (
    <Fragment>
      <Overlay visible={resultsShown} />
      <Container>
        <StyledInput
          ref={input}
          id="input"
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          placeholder={`Search ${props.siteName}`}
          resultsShown={resultsShown}
        />
        {resultsShown && (
          <ResetButton
            onMouseDown={() => event.preventDefault()}
            onClick={reset}
          >
            <ResetIcon />
          </ResetButton>
        )}
        {!focused && !value && <Hotkey>/</Hotkey>}
      </Container>
    </Fragment>
  );
}

Search.propTypes = {
  siteName: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  indexName: PropTypes.string.isRequired
};
