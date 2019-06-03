import PropTypes from 'prop-types';
import React, {useState} from 'react';

export function MultiCodeBlock(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!Array.isArray(props.children)) {
    return props.children;
  }

  return (
    <div>
      {props.children.map((child, index) => {
        console.log(child);
        return (
          <button key={index} onClick={() => setActiveIndex(index)}>
            block {index + 1}
          </button>
        );
      })}
      {props.children[activeIndex]}
    </div>
  );
}

MultiCodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};
