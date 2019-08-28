import PropTypes from 'prop-types';
import React from 'react';
import SelectLink from './select-link';
import styled from '@emotion/styled';
import {Button} from './buttons';
import {
  GA_EVENT_CATEGORY_SIDEBAR,
  getVersionBasePath,
  trackEvent
} from '../utils';
import {SidebarNav, colors, headerHeight} from 'gatsby-theme-apollo-core';
import {StyledIcon} from './select';

const headerPadding = 4;
const ContentHeader = styled.h4({
  color: colors.primary,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  position: 'sticky',
  top: headerHeight
});

const HeaderInner = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: `-${headerPadding}px 0`,
  padding: `${headerPadding}px 0`,
  paddingRight: 16
});

const StyledButton = styled(Button)({
  flexGrow: 1,
  textAlign: 'left',
  position: 'relative'
});

function getVersionLabel(version) {
  return `Version ${version}`;
}

function handleToggleAll(expanded) {
  trackEvent({
    eventCategory: GA_EVENT_CATEGORY_SIDEBAR,
    eventAction: 'toggle all',
    eventLabel: expanded ? 'expand' : 'collapse'
  });
}

function handleToggleCategory(title, expanded) {
  trackEvent({
    eventCategory: GA_EVENT_CATEGORY_SIDEBAR,
    eventAction: 'toggle category',
    eventLabel: title,
    eventValue: Number(expanded)
  });
}

export default function SidebarContent(props) {
  return (
    <div className="sidebar">
      <ContentHeader>
        <HeaderInner>
          <StyledButton
            variant="flat"
            color="branded"
            size="small"
            className="title-sidebar"
          >
            {props.title}
            <StyledIcon />
          </StyledButton>
          {props.versions.length > 0 && (
            <SelectLink
              useLink
              size="small"
              variant="hidden"
              isPathActive={props.isPathActive}
              options={[
                {
                  text: props.defaultVersion
                    ? getVersionLabel(props.defaultVersion)
                    : 'Latest',
                  value: '/'
                }
              ].concat(
                props.versions.map(version => ({
                  text: getVersionLabel(version),
                  value: getVersionBasePath(version)
                }))
              )}
            />
          )}
        </HeaderInner>
      </ContentHeader>
      <SidebarNav
        contents={props.contents}
        pathname={props.pathname}
        onToggleAll={handleToggleAll}
        onToggleCategory={handleToggleCategory}
      />
    </div>
  );
}

SidebarContent.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  isPathActive: PropTypes.func.isRequired,
  defaultVersion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  versions: PropTypes.array.isRequired
};
