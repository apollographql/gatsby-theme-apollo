import DocsetSwitcher from './docset-switcher';
import PropTypes from 'prop-types';
import React from 'react';
import SelectLink from './select-link';
import styled from '@emotion/styled';
import {
  GA_EVENT_CATEGORY_SIDEBAR,
  getVersionBasePath,
  trackEvent
} from '../utils';
import {SidebarNav} from 'gatsby-theme-apollo-core';

const HeaderInner = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginLeft: -8,
  marginBottom: 16,
  paddingRight: 16
});

function getVersionLabel(version) {
  return `v${version}`;
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
      <HeaderInner>
        <DocsetSwitcher
          title={props.title}
          siteName={props.siteName}
          navItems={props.navItems}
        />
        {props.versions.length > 0 && (
          <SelectLink
            useLink
            size="small"
            variant="hidden"
            isPathActive={props.isPathActive}
            style={{marginLeft: 8}}
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
  siteName: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired,
  contents: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  isPathActive: PropTypes.func.isRequired,
  defaultVersion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  versions: PropTypes.array.isRequired
};
