import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {SidebarNav, colors} from 'gatsby-theme-apollo';

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

export default function SidebarContent(props) {
  return (
    <div className="sidebar">
      <SidebarContentHeader>
        <SidebarContentHeaderText className="title-sidebar">
          {props.title}
        </SidebarContentHeaderText>
        {/* {versions.length > 1 && (
                <SelectLink
                  useLink
                  isPathActive={this.isPathActive}
                  options={versions.map(({id, basePath}) => ({
                    text: `Version ${id}`,
                    value: basePath
                  }))}
                />
              )} */}
      </SidebarContentHeader>
      <SidebarNav contents={props.contents} pathname={props.pathname} />
    </div>
  );
}

SidebarContent.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired
};
