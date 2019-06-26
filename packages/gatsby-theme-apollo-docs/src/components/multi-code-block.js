import PropTypes from 'prop-types';
import React, {createContext, useState} from 'react';
import styled from '@emotion/styled';

const Container = styled.div({
  position: 'relative'
});

export const MultiCodeBlockContext = createContext({});

export function MultiCodeBlock(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!Array.isArray(props.children)) {
    return props.children;
  }

  function handleLanguageChange(event) {
    setActiveIndex(event.target.value);
  }

  return (
    <Container>
      <MultiCodeBlockContext.Provider
        value={{
          activeIndex,
          languages: props.children.map(child => {
            const language = child.props['data-language'];
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
          }),
          onLanguageChange: handleLanguageChange
        }}
      >
        {props.children[activeIndex]}
      </MultiCodeBlockContext.Provider>
    </Container>
  );
}

MultiCodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};
