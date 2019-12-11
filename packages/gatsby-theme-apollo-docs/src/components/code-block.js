import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import styled from '@emotion/styled';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import {Button} from '@apollo/space-kit/Button';
import {
  GA_EVENT_CATEGORY_CODE_BLOCK,
  MultiCodeBlockContext
} from './multi-code-block';
import {Select} from './select';
import {colors} from 'gatsby-theme-apollo-core';

const Container = styled.div({
  marginBottom: '1.45rem',
  border: `1px solid ${colors.divider}`,
  borderRadius: 4
});

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: 10,
  borderBottom: `1px solid ${colors.divider}`
});

const StyledSelect = styled(Select)({
  marginRight: 8
});

const InnerContainer = styled.div({
  padding: 15,
  backgroundColor: colors.background,
  overflow: 'auto'
});

export default function CodeBlock(props) {
  const code = useRef();
  const [copied, copyToClipboard] = useCopyToClipboard();

  function handleCopy() {
    if (typeof window.analytics !== 'undefined') {
      window.analytics.track('Copy', {
        category: GA_EVENT_CATEGORY_CODE_BLOCK
      });
    }

    copyToClipboard(code.current.innerText);
  }

  return (
    <Container>
      <Header>
        <MultiCodeBlockContext.Consumer>
          {({languages, onLanguageChange, selectedLanguage}) =>
            languages && (
              <StyledSelect
                size="small"
                feel="flat"
                value={selectedLanguage}
                onChange={onLanguageChange}
                options={languages.reduce(
                  (acc, {lang, label}) => ({
                    ...acc,
                    [lang]: label
                  }),
                  {}
                )}
              />
            )
          }
        </MultiCodeBlockContext.Consumer>
        <Button feel="flat" size="small" onClick={handleCopy}>
          {copied.value ? 'Copied!' : 'Copy'}
        </Button>
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
