import PropTypes from 'prop-types';
import React, {createContext, useMemo, useState} from 'react';
import styled from '@emotion/styled';

const Container = styled.div({
  position: 'relative'
});

export const GA_EVENT_CATEGORY_CODE_BLOCK = 'Code Block';
export const MultiCodeBlockContext = createContext({});

function getLanguageLabel(language) {
  switch (language) {
    case 'javascript':
    case 'js':
    case 'jsx':
      return 'JavaScript';
    case 'typescript':
    case 'ts':
    case 'tsx':
      return 'TypeScript';
    case 'hooks-js':
      return 'Hooks (JS)';
    case 'hooks-ts':
      return 'Hooks (TS)';
    default:
      return language;
  }
}

export function MultiCodeBlock(props) {
  const codeBlocks = useMemo(
    () =>
      Array.isArray(props.children)
        ? props.children.reduce((acc, child) => {
            const lang = child.props['data-language'];
            return lang ? {...acc, [lang]: child} : acc;
          }, {})
        : {},
    [props.children]
  );

  const languages = useMemo(() => Object.keys(codeBlocks), [codeBlocks]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  if (!languages.length) {
    return props.children;
  }

  function handleLanguageChange(language) {
    if (typeof window.analytics !== 'undefined') {
      window.analytics.track('Change language', {
        category: GA_EVENT_CATEGORY_CODE_BLOCK,
        label: language
      });
    }
    setSelectedLanguage(language);
  }

  return (
    <Container>
      <MultiCodeBlockContext.Provider
        value={{
          selectedLanguage,
          languages: languages.map(language => ({
            lang: language,
            label: getLanguageLabel(language)
          })),
          onLanguageChange: handleLanguageChange
        }}
      >
        {/* TODO: add titles */}
        {codeBlocks[selectedLanguage]}
      </MultiCodeBlockContext.Provider>
    </Container>
  );
}

MultiCodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};
