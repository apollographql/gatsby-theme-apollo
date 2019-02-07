import React from 'react';
import styled from '@emotion/styled';
import {ReactComponent as LogoSmall} from '../../ui/logo-small.svg';
import {StaticQuery, graphql} from 'gatsby';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center'
});

const StyledLogoSmall = styled(LogoSmall)({
  marginRight: 8,
  height: 36,
  fill: 'currentColor'
});

export default function LogoTitle() {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <Container>
          <StyledLogoSmall />
          {data.site.siteMetadata.title}
        </Container>
      )}
    />
  );
}
