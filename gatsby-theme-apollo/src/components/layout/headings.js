import PropTypes from 'prop-types';
import React from 'react';
import Slugger from 'github-slugger';
import styled from '@emotion/styled';

const Container = styled.aside({
  flexShrink: 0,
  width: 150,
  marginLeft: 'auto',
  position: 'sticky',
  top: 0
});

export default function Headings(props) {
  const slugger = new Slugger();
  return (
    <Container>
      <h6>Contents</h6>
      <ul>
        {props.page.headings.map(({depth, value}, index) => {
          const slug = slugger.slug(value);
          if (depth > 3) {
            // return null here instead of using array.filter
            // we want the slug results to match those from remark-slug
            return null;
          }

          return (
            <li key={`${props.page.id}-${index}`}>
              <a href={`#${slug}`}>{value}</a>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

Headings.propTypes = {
  page: PropTypes.object.isRequired
};
