import React from 'react';
import Helmet from 'react-helmet';

const title = 'Apollo Documentation';
export default function Layout(props) {
  return (
    <div>
      <Helmet defaultTitle={title} titleTemplate={`%s · ${title}`} />
      <header>Apollo</header>
      {props.children}
    </div>
  )
}
