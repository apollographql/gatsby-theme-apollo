import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import styled from '@emotion/styled';
import {colors, smallCaps} from 'gatsby-theme-apollo';

const Container = styled.div({
  margin: '0.5em 0 1.45em',
  border: `1px solid ${colors.divider}`,
  borderRadius: 4
});

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  borderBottom: `1px solid ${colors.divider}`
});

const StyledHeading = styled.h5({
  margin: 0,
  marginRight: 'auto',
  color: colors.text2
});

const CopiedMessage = styled.span({
  marginRight: 12,
  color: colors.text3
});

const StyledButton = styled.button(smallCaps, {
  padding: '8px 16px',
  border: `1px solid ${colors.primary}`,
  borderRadius: 4,
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 600,
  color: colors.primary,
  backgroundColor: 'white',
  outline: 'none',
  cursor: 'pointer',
  ':hover': {
    opacity: colors.hoverOpacity
  }
});

const InnerContainer = styled.div({
  padding: '1em',
  backgroundColor: colors.background,
  overflow: 'auto'
});

export default function CodeBlock(props) {
  const code = useRef();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    setCopied(false);
    const result = await navigator.permissions.query({name: 'clipboard-write'});
    if (['granted', 'prompt'].includes(result.state)) {
      await navigator.clipboard.writeText(code.current.innerText);
      setCopied(true);
    }
  }

  return (
    <Container>
      <Header>
        <StyledHeading>
          <code>{props.filename}</code>
        </StyledHeading>
        {copied && <CopiedMessage>Copied!</CopiedMessage>}
        <StyledButton onClick={handleCopy}>Copy</StyledButton>
      </Header>
      <InnerContainer>
        <pre className={props.className} ref={code}>
          {props.children}
        </pre>
      </InnerContainer>
    </Container>
  );
}

CodeBlock.propTypes = {
  className: PropTypes.string,
  filename: PropTypes.string,
  children: PropTypes.node.isRequired
};
