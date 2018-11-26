import React from 'react';

export default function Button(props) {
  return <button style={{color: props.red ? 'red': 'blue'}}>{props.children}</button>
}
