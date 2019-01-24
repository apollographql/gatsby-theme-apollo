import React from 'react';
import SearchInput from './search-input';
import styled from '@emotion/styled';
import {InstantSearch} from 'react-instantsearch-dom';

const Container = styled.div({
  flexGrow: 1,
  maxWidth: 480,
  marginRight: 'auto'
});

export default function Search() {
  return (
    <Container>
      <InstantSearch
        appId="latency"
        apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
        indexName="bestbuy"
      >
        <SearchInput />
      </InstantSearch>
    </Container>
  );
}
