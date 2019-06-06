import PropTypes from 'prop-types';
import React, {createContext, useRef, useState} from 'react';
import clipboard from 'clipboard-polyfill';
import styled from '@emotion/styled';
import {colors, smallCaps} from 'gatsby-theme-apollo';

const Container = styled.div({
  margin: '0.5em 0 1.45em',
  border: `1px solid ${colors.divider}`,
  borderRadius: 4
});

const headerBorderWidth = 1;
const headerVerticalPadding = 12;
const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  padding: `${headerVerticalPadding}px 16px`,
  borderBottom: `${headerBorderWidth}px solid ${colors.divider}`
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

const buttonBorderWidth = 1;
const buttonFontSize = 14;
const buttonLineHeight = 1;
const buttonVerticalPadding = 8;
const StyledButton = styled.button(smallCaps, {
  padding: `${buttonVerticalPadding}px 16px`,
  border: `${buttonBorderWidth}px solid ${colors.primary}`,
  borderRadius: 4,
  fontSize: buttonFontSize,
  lineHeight: buttonLineHeight,
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

export const CodeBlockContext = createContext({
  filename: ''
});

export const CODE_BLOCK_HEADER_HEIGHT =
  headerVerticalPadding * 2 +
  headerBorderWidth +
  buttonFontSize * buttonLineHeight +
  buttonVerticalPadding * 2 +
  buttonBorderWidth * 2;

export default function CodeBlock(props) {
  const code = useRef();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    setCopied(false);
    await clipboard.writeText(code.current.innerText);
    setCopied(true);
  }

  return (
    <Container>
      <Header>
        <StyledHeading>
          <CodeBlockContext.Consumer>
            {({filename}) => <code>{filename}</code>}
          </CodeBlockContext.Consumer>
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
  children: PropTypes.node.isRequired
};
