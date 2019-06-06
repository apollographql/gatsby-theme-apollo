import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Slugger from 'github-slugger';
import nest from 'recompose/nest';
import striptags from 'striptags';
import styled from '@emotion/styled';
import {FaGithub} from 'react-icons/fa';
import {PageNav, breakpoints, colors, headerHeight} from 'gatsby-theme-apollo';
import {ReactComponent as SpectrumLogo} from '../assets/logos/spectrum.svg';
import {withPrefix} from 'gatsby';

const Container = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  maxWidth: 1200
});

const MainContent = styled.main({
  flexGrow: 1,
  width: 0,
  maxWidth: '100ch'
});

const BodyContent = styled.div({
  // style all anchors with an href and no prior classes
  // this helps avoid anchors with names and styled buttons
  'a[href]:not([class])': {
    color: colors.primary,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    },
    code: {
      color: 'inherit'
    }
  },
  [['h1', 'h2', 'h3', 'h4', 'h5', 'h6']]: {
    '&[id]::before': {
      // inspired by https://css-tricks.com/hash-tag-links-padding/
      content: "''",
      display: 'block',
      marginTop: -headerHeight,
      height: headerHeight,
      visibility: 'hidden',
      pointerEvents: 'none'
    },
    ':not(:hover) a svg': {
      visibility: 'hidden'
    },
    'a.anchor': {
      float: 'left',
      marginLeft: -20,
      paddingRight: 4,
      ':hover': {
        opacity: colors.hoverOpacity
      },
      svg: {
        fill: colors.primary
      }
    }
  },
  [['h2', 'h3', 'h4']]: {
    ':not(:first-child)': {
      marginTop: 56
    }
  },
  img: {
    display: 'block',
    maxWidth: '100%',
    margin: '0 auto'
  }
});

const Aside = styled.aside({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: 260,
  maxHeight: `calc(100vh - ${headerHeight}px)`,
  marginTop: -36,
  marginLeft: 'auto',
  padding: '40px 56px',
  paddingRight: 0,
  position: 'sticky',
  top: headerHeight,
  [breakpoints.lg]: {
    display: 'none'
  },
  [breakpoints.md]: {
    display: 'block'
  },
  [breakpoints.sm]: {
    display: 'none'
  }
});

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

const AsideLink = nest(
  styled.h5({
    display: 'flex'
  }),
  styled.a({
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
    ':hover': {
      opacity: colors.hoverOpacity
    },
    svg: {
      width: 20,
      height: 20,
      marginRight: 6,
      fill: colors.text2
    }
  })
);

export default function PageContent(props) {
  const pageIndex = props.pages.findIndex(page => {
    const prefixedPath = withPrefix(page.path);
    return (
      prefixedPath === props.pathname ||
      prefixedPath.replace(/\/$/, '') === props.pathname
    );
  });

  const slugger = new Slugger();
  return (
    <Container>
      <MainContent>
        <BodyContent className="content-wrapper">{props.children}</BodyContent>
        <PageNav
          prevPage={props.pages[pageIndex - 1]}
          nextPage={props.pages[pageIndex + 1]}
        />
      </MainContent>
      <Aside>
        {props.headings.length > 0 && (
          <Fragment>
            <AsideHeading>In this section</AsideHeading>
            <AsideList>
              {props.headings.map(({value}) => {
                const text = striptags(value);
                const slug = slugger.slug(text);
                return (
                  <AsideListItem
                    key={slug}
                    active={slug === props.activeHeading}
                  >
                    <a href={`#${slug}`}>{text}</a>
                  </AsideListItem>
                );
              })}
            </AsideList>
          </Fragment>
        )}
        <AsideLink href={props.githubUrl}>
          <FaGithub /> Edit on GitHub
        </AsideLink>
        <AsideLink href={`https://spectrum.chat/apollo/${props.spectrumPath}`}>
          <SpectrumLogo /> Discuss on Spectrum
        </AsideLink>
      </Aside>
    </Container>
  );
}

PageContent.propTypes = {
  children: PropTypes.node.isRequired,
  pathname: PropTypes.string.isRequired,
  githubUrl: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired,
  headings: PropTypes.array.isRequired,
  activeHeading: PropTypes.string,
  spectrumPath: PropTypes.string
};
