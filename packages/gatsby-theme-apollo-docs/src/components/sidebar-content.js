import PropTypes from 'prop-types';
import React from 'react';
import SelectLink from './select-link';
import styled from '@emotion/styled';
import {SidebarNav, colors} from 'gatsby-theme-apollo';
import {getVersionBasePath} from '../utils';

const SidebarContentHeader = styled.h4({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: 16,
  color: colors.primary
});

const SidebarContentHeaderText = styled.span({
  lineHeight: 1.5
});

function getVersionLabel(version) {
  return `Version ${version}`;
}

export default function SidebarContent(props) {
  return (
    <div className="sidebar">
      <SidebarContentHeader>
        <SidebarContentHeaderText className="title-sidebar">
          {props.title}
        </SidebarContentHeaderText>
        {Array.isArray(props.versions) && (
          <SelectLink
            useLink
            isPathActive={props.isPathActive}
            options={[
              ...props.versions.map(version => ({
                text: getVersionLabel(version),
                value: getVersionBasePath(version)
              })),
              {
                text: props.defaultVersion
                  ? getVersionLabel(props.defaultVersion)
                  : 'Latest',
                value: '/'
              }
            ]}
          />
        )}
      </SidebarContentHeader>
      <SidebarNav contents={props.contents} pathname={props.pathname} />
    </div>
  );
}

SidebarContent.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  isPathActive: PropTypes.func.isRequired,
  defaultVersion: PropTypes.string,
  versions: PropTypes.array
};
