import React from 'react';
import colors from '../../util/colors';
import styled from '@emotion/styled';
import {
  InstantSearch,
  SearchBox,
  connectStateResults
} from 'react-instantsearch-dom';

const inputPadding = 16;
const borderRadius = 5;
const border = `1px solid ${colors.textTertiary}`;
const verticalAlign = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)'
};

const Hotkey = styled.div({
  ...verticalAlign,
  width: 24,
  height: 24,
  border,
  borderRadius,
  textAlign: 'center',
  lineHeight: '20px',
  right: inputPadding / 2
});

const Container = styled.div({
  flexGrow: 1,
  maxWidth: 480,
  marginRight: 'auto',
  position: 'relative',
  '.ais-SearchBox-form': {
    position: 'relative',
    color: colors.text2
  },
  '.ais-SearchBox-input': {
    width: '100%',
    height: 40,
    padding: 0,
    paddingLeft: inputPadding,
    border,
    borderRadius,
    fontSize: 14,
    background: 'none',
    outline: 'none',
    ':focus': {
      borderColor: colors.text2
    }
  },
  '.ais-SearchBox-submitIcon': {
    display: 'none'
  },
  '.ais-SearchBox-reset': {
    ...verticalAlign,
    right: inputPadding
  },
  '.ais-SearchBox-resetIcon': {
    display: 'block',
    fill: 'currentColor',
    width: 12,
    height: 12
  }
});

const Results = styled.div({
  maxHeight: 640,
  marginTop: 14,
  borderRadius,
  boxShadow: 'rgba(0,0,0,0.1) 0 2px 12px',
  backgroundColor: 'white',
  overflow: 'auto',
  position: 'absolute',
  top: '100%',
  left: 0
});

const SearchResults = connectStateResults(
  ({searchResults}) =>
    searchResults &&
    searchResults.query.trim() &&
    searchResults.hits.map(hit => <div key={hit.objectID}>{hit.name}</div>)
);

export default function Search() {
  return (
    <Container>
      <InstantSearch
        appId="latency"
        apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
        indexName="bestbuy"
      >
        <SearchBox focusShortcuts={[191]} />
        <Results>
          <SearchResults />
        </Results>
      </InstantSearch>
      <Hotkey>/</Hotkey>
    </Container>
  );
}
