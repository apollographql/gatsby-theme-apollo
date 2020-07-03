import React from 'react';
import styled from '@emotion/styled';
//https://commons.wikimedia.org/wiki/File:HelloWorld.svg
import { ReactComponent as HelloLogoIcon } from '../../assets/logo.svg';
import { ReactComponent as DocsIcon } from 'gatsby-theme-apollo-docs/src/assets/docs.svg';

const Wrapper = styled.div({
    display: 'flex',
    fontSize: 24,
});

const StyledHelloLogoIcon = styled(HelloLogoIcon)({
    height: '3em',
    position: 'relative',
    top: '6px',
    width:'3em',
    marginRight: '0.2857142857em',
});

const StyledDocsIcon = styled(DocsIcon)({
    height: '0.7857142857em',
    marginTop: '0.07142857143em',
});

export default function Logo() {
    return (
        <Wrapper>
            <StyledHelloLogoIcon viewBox="0 0 100 100"  preserveAspectRatio='slice'/>
            <StyledDocsIcon/>
        </Wrapper>
    );
}
