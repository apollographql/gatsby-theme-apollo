import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';
import styled from '@emotion/styled';
import {Link} from 'gatsby';

const Container = styled.aside({
  flexShrink: 0,
  width: 240,
  backgroundColor: 'lightgrey',
  overflowY: 'auto'
});

export default function Sidebar(props) {
  const sections = groupBy(props.pages, page => {
    const segments = page.path.split('/').filter(Boolean);
    return segments[segments.length - 2];
  });

  return (
    <Container>
      <select>
        {props.tags.map(tag => (
          <option key={tag.id}>{tag.name}</option>
        ))}
      </select>
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
  pages: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired
};
