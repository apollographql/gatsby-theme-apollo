import React from 'react';

export default function Layout(props) {
  return (
    <div>
      <header>Apollo</header>
      {props.children}
    </div>
  )
}
