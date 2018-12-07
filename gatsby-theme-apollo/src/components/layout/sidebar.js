import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';
import styled from '@emotion/styled';
import {
  InstantSearch,
  SearchBox,
  connectStateResults
} from 'react-instantsearch-dom';
import {Link} from 'gatsby';

const Container = styled.aside({
  flexShrink: 0,
  width: 240,
  backgroundColor: 'lightgrey',
  overflowY: 'auto'
});

const SearchResults = connectStateResults(
  ({searchResults}) =>
    searchResults &&
    searchResults.query.trim() &&
    searchResults.hits.map(hit => <div key={hit.objectID}>{hit.name}</div>)
);

export default function Sidebar(props) {
  const sections = groupBy(props.pages, page => {
    const segments = page.path.split('/').filter(Boolean);
    return segments[segments.length - 2];
  });

  return (
    <Container>
      <InstantSearch
        appId="latency"
        apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
        indexName="bestbuy"
      >
        <SearchBox />
        <SearchResults />
      </InstantSearch>
      {Object.keys(sections).map(key => (
        <Fragment key={key}>
          {key !== 'undefined' && <h6>{startCase(key)}</h6>}
          <ul>
            {sections[key].map(page => (
              <li key={page.id}>
                <Link to={page.path}>{page.frontmatter.title}</Link>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </Container>
  );
}

Sidebar.propTypes = {
  pages: PropTypes.array.isRequired
};
