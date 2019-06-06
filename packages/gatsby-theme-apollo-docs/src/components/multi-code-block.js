import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from '@emotion/styled';
import {CODE_BLOCK_HEADER_HEIGHT} from './code-block';
import {FaJs, FaReact} from 'react-icons/fa';
import {GiFishingHook} from 'react-icons/gi';
import {colors} from 'gatsby-theme-apollo';
import {size, transparentize} from 'polished';

const Container = styled.div({
  position: 'relative'
});

const Buttons = styled.div({
  display: 'flex',
  borderRadius: 4,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  overflow: 'hidden',
  position: 'absolute',
  top: CODE_BLOCK_HEADER_HEIGHT,
  right: 16
});

const StyledButton = styled.button(size(28), {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 0,
  color: 'white',
  backgroundColor: transparentize(0.5, colors.text2),
  cursor: 'pointer',
  outline: 'none'
});

const icons = {
  js: FaJs,
  jsx: FaReact,
  hooks: GiFishingHook
};

export function MultiCodeBlock(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!Array.isArray(props.children)) {
    return props.children;
  }

  return (
    <Container>
      {props.children[activeIndex]}
      <Buttons>
        {props.children.map((child, index) => {
          const language = child.props['data-language'];
          const Icon = icons[language];
          return (
            <StyledButton
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                backgroundColor: activeIndex === index && colors.text2
              }}
            >
              {Icon ? <Icon size={16} /> : language}
            </StyledButton>
          );
        })}
      </Buttons>
    </Container>
  );
}

MultiCodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};
