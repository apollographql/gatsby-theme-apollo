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

function getLang(child) {
  return child.props['data-language'];
}

export function MultiCodeBlock(props) {
  const {codeBlocks, titles} = useMemo(() => {
    const defaultState = {
      codeBlocks: {},
      titles: {}
    };

    if (!Array.isArray(props.children)) {
      return defaultState;
    }

    return props.children.reduce((acc, child, index, array) => {
      const lang = getLang(child);
      if (lang) {
        return {
          ...acc,
          codeBlocks: {
            ...acc.codeBlocks,
            [lang]: child
          }
        };
      }

      const nextNode = array[index + 1];
      if (nextNode && Array.isArray(child.props.children)) {
        const [title] = child.props.children.filter(
          child => child.props && child.props.className === 'gatsby-code-title'
        );
        if (title) {
          const lang = getLang(nextNode);
          if (lang) {
            return {
              ...acc,
              titles: {
                ...acc.titles,
                [lang]: title
              }
            };
          }
        }
      }

      return acc;
    }, defaultState);
  }, [props.children]);

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
        {titles[selectedLanguage]}
        {codeBlocks[selectedLanguage]}
      </MultiCodeBlockContext.Provider>
    </Container>
  );
}

MultiCodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};
