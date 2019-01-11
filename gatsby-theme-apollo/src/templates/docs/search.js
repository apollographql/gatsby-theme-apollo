import React from 'react';
import colors from '../../util/colors';
import styled from '@emotion/styled';
import {
  InstantSearch,
  SearchBox,
  connectStateResults
} from 'react-instantsearch-dom';

const inputHeight = 40;
const inputPadding = 16;
const submitIconSize = 16;
const resetIconSize = 12;
const iconMargin = 8;
const Container = styled.div({
  position: 'relative',
  '.ais-SearchBox-form': {
    position: 'relative',
    color: colors.textSecondary
  },
  '.ais-SearchBox-input': {
    height: inputHeight,
    padding: 0,
    paddingLeft: inputPadding + submitIconSize + iconMargin,
    paddingRight: inputPadding + resetIconSize + iconMargin,
    border: `1px solid ${colors.textTertiary}`,
    borderRadius: inputHeight / 2,
    fontSize: 14,
    background: 'none',
    outline: 'none',
    ':focus': {
      borderColor: colors.text
    }
  },
  [['.ais-SearchBox-submit', '.ais-SearchBox-reset']]: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  '.ais-SearchBox-submit': {
    left: inputPadding
  },
  '.ais-SearchBox-reset': {
    right: inputPadding
  },
  [['.ais-SearchBox-submitIcon', '.ais-SearchBox-resetIcon']]: {
    display: 'block',
    fill: 'currentColor'
  },
  '.ais-SearchBox-submitIcon': {
    width: submitIconSize,
    height: submitIconSize
  },
  '.ais-SearchBox-resetIcon': {
    width: resetIconSize,
    height: resetIconSize
  }
});

const Results = styled.div({
  maxHeight: 500,
  backgroundColor: 'white',
  overflow: 'auto',
  position: 'absolute',
  top: '100%',
  right: 0
});

const SearchResults = connectStateResults(
  ({searchResults}) =>
    searchResults &&
    searchResults.query.trim() &&
    searchResults.hits.map(hit => <div key={hit.objectID}>{hit.name}</div>)
);

export default function Search() {
  return (
    <InstantSearch
      appId="latency"
      apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
      indexName="bestbuy"
    >
      <Container>
        <SearchBox />
        <Results>
          <SearchResults />
        </Results>
      </Container>
    </InstantSearch>
  );
}
