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
        {props.versions.length > 0 && (
          <SelectLink
            useLink
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
      <SidebarNav contents={props.contents} pathname={props.pathname} />
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
