import PropTypes from 'prop-types';
import React, {Fragment, useEffect, useState} from 'react';
import Slugger from 'github-slugger';
import striptags from 'striptags';
import styled from '@emotion/styled';
import useScroll from 'react-use/lib/useScroll';
import useWindowSize from 'react-use/lib/useWindowSize';
import {colors} from 'gatsby-theme-apollo';

const AsideHeading = styled.h4({
  fontWeight: 600
});

const AsideList = styled.ul({
  marginLeft: 0,
  marginBottom: 48,
  overflow: 'auto'
});

const AsideListItem = styled.li(props => ({
  listStyle: 'none',
  fontSize: '1rem',
  color: props.active && colors.primary,
  a: {
    color: 'inherit',
    textDecoration: 'none',
    ':hover': {
      opacity: colors.hoverOpacity
    }
  }
}));

export default function SectionNav(props) {
  const {y} = useScroll(props.mainRef);
  const {width, height} = useWindowSize();
  const [offsets, setOffsets] = useState([]);

  const {contentRef, imagesLoaded} = props;
  useEffect(() => {
    const headings = contentRef.current.querySelectorAll('h1, h2');
    setOffsets(
      Array.from(headings)
        .map(heading => {
          const anchor = heading.querySelector('a');
          if (!anchor) {
            return null;
          }

          return {
            id: heading.id,
            offset: anchor.offsetTop
          };
        })
        .filter(Boolean)
    );
  }, [width, height, contentRef, imagesLoaded]);

  let activeHeading = null;
  const windowOffset = height / 2;
  const scrollTop = y + windowOffset;
  for (let i = offsets.length - 1; i >= 0; i--) {
    const {id, offset} = offsets[i];
    if (scrollTop >= offset) {
      activeHeading = id;
      break;
    }
  }

  const slugger = new Slugger();
  return (
    <Fragment>
      <AsideHeading>In this section</AsideHeading>
      <AsideList>
        {props.headings.map(({value}) => {
          const text = striptags(value);
          const slug = slugger.slug(text);
          return (
            <AsideListItem key={slug} active={slug === activeHeading}>
              <a href={`#${slug}`}>{text}</a>
            </AsideListItem>
          );
        })}
      </AsideList>
    </Fragment>
  );
}

SectionNav.propTypes = {
  headings: PropTypes.array.isRequired,
  imagesLoaded: PropTypes.bool.isRequired,
  mainRef: PropTypes.object.isRequired,
  contentRef: PropTypes.object.isRequired
};
