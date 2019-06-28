import PropTypes from 'prop-types';
import React from 'react';
import SelectLink from './select-link';
import styled from '@emotion/styled';
import {
  GA_EVENT_CATEGORY_SIDEBAR,
  getVersionBasePath,
  trackEvent
} from '../utils';
import {SidebarNav, colors} from 'gatsby-theme-apollo';

const SidebarContentHeader = styled.h4({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: 12,
  color: colors.primary
});

const SidebarContentHeaderText = styled.span({
  lineHeight: 1.5
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
      <SidebarContentHeader>
        <SidebarContentHeaderText className="title-sidebar">
          {props.title}
        </SidebarContentHeaderText>
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
      </SidebarContentHeader>
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
