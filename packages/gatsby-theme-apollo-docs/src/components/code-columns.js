import React from 'react';
import styled from '@emotion/styled';

export function CodeColumns(props) {
  const ThreeColumns = styled.div({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 0.33fr))',
    gridGap: '5px'
  });

  const TwoColumns = styled.div({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 0.5fr))',
    gridGap: '20px'
  });

  if (props.cols == 3) {
    return (
      <ThreeColumns className="code-columns three-columns">
        { props.children }
      </ThreeColumns>
    );
  } else {
    return (
      <TwoColumns className="code-columns two-columns">
        { props.children }
      </TwoColumns>
    );
  }
}
