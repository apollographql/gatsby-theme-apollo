import React from 'react';
import styled from '@emotion/styled';
import {
  InstantSearch,
  SearchBox,
  connectStateResults
} from 'react-instantsearch-dom';

const Container = styled.div({
  color: 'black',
  position: 'relative',
  zIndex: 1
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
