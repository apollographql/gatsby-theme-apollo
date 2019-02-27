# gatsby-theme-apollo

This is the base theme for building Apollo-branded Gatsby sites. It contains a small amount of configuration, and a handful of components that make it easy to build consistent-looking UIs.

It comes with a few Gatsby plugins:

 - `gatsby-plugin-svgr` enables [importing SVGs as React components](https://www.gatsbyjs.org/packages/gatsby-plugin-svgr)
 - `gatsby-plugin-emotion` server renders your [Emotion](https://emotion.sh) styles
 - `gatsby-plugin-react-helmet` server renders `<head>` tags set with [React Helmet](https://github.com/nfl/react-helmet)
 - `gatsby-plugin-typography` provides a stylesheet reset and sets default styles for basic HTML elements

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Components and utilities](#components-and-utilities)
  - [Layout](#layout)

## Installation

```bash
$ npm install gatsby gatsby-theme-apollo
```

## Usage

```js
// gatsby-config.js
module.exports = {
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-apollo',
      options: {
        root: __dirname
      }
    }
  ],
  siteMetadata: {
    title: 'Apollo rocks!',
    description: 'Gatsby themes are pretty cool too...'
  }
};
```

## Components and utilities

All of the React components and utilities documented here are available as named exports in the `gatsby-theme-apollo` package. You can import them like this:

```js
import {MenuButton, Sidebar, breakpoints} from 'gatsby-theme-apollo';
```

### Layout

`Layout` should wrap every page that gets created. It configures [React Helmet](https://github.com/nfl/react-helmet) and sets the meta description tag with data from the `siteMetadata` property in your Gatsby config. It also sets the favicon for the page to the Apollo "A" logo.

```js
import {Layout} from 'gatsby-theme-apollo';

function MyPage() {
  return (
    <Layout>
      Hello world
    </Layout>
  );
}
```

| Prop name | Type | Required |
| --------- | ---- | -------- |
| children  | Node | yes      |

### Header

A sticky header component with a white background and our brand primary, ![#220a82](https://placehold.it/15/220a82/000000?text=+) `#220a82` as the font color.

`MobileHeader` and `DesktopHeader` components are also exported, and can be used to easily render headers with different content depending on the window size.

```js
import {Layout, MobileHeader, DesktopHeader} from 'gatsby-theme-apollo';

function MyPage() {
  return (
    <Layout>
      <MobileHeader>
        This is only shown on mobile
        <HamburgerMenu />
      </MobileHeader>
      <DesktopHeader>
        <Logo />
        This is only shown on desktop
        <HorizontalMenu />
      </DesktopHeader>
    </Layout>
  );
}
```

| Prop name | Type | Required |
| --------- | ---- | -------- |
| children  | Node | yes      |
