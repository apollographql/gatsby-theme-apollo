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
  - [Header](#header)
  - [Sidebar](#sidebar)
  - [colors](#colors)

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
| children  | node | yes      |

### Header

A sticky header component with a white background and our brand primary, ![#220a82](https://placehold.it/15/220a82/000000?text=+) `#220a82` as the font color.

```js
import {Layout, Header} from 'gatsby-theme-apollo';

function MyPage() {
  return (
    <Layout>
      <Header>Main nav goes up here</Header>
    </Layout>
  );
}
```

`MobileHeader` and `DesktopHeader` components are also exported, and can be used to easily render headers with different content depending on the window size.

```js
import {Layout, MobileHeader, DesktopHeader} from 'gatsby-theme-apollo';

function MyResponsivePage() {
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
| children  | node | yes      |

### Sidebar

A component that renders a sidebar with the site title configured in the [`siteMetadata` Gatsby config option](https://www.gatsbyjs.org/docs/gatsby-config/#sitemetadata), and an Apollo "A" logo on the top left side. It can also be configured to collapse into the left side of the page on narrow windows.

```js
import {Layout, Sidebar} from 'gatbsy-theme-apollo';

function MyPage() {
  return (
    <Layout>
      <Sidebar>
        Sidebar content goes here
      </Sidebar>
    </Layout>
  );
}
```

| Prop name  | Type | Required | Description                                                                      |
| ---------- | ---- | -------- | -------------------------------------------------------------------------------- |
| children   | node | yes      |                                                                                  |
| responsive | bool | no       | If `true`, the sidebar will behave as a drawer absolutely positioned on the left |
| open       | bool | no       | Controls the sidebar visibility when the `responsive` prop is `true`             |
| noLogo     | bool | no       | If `true`, the logo next to the site title at the top left will be hidden        |

### colors

A mapping of named keys and their corresponding hex color codes. You can use this object to write CSS-in-JS rules like this:

```js
import {colors} from 'gatsby-theme-apollo';

const StyledButton = styled.button({
  color: colors.primary,
  background: colors.background
});
```

 - ![#220a82](https://placehold.it/15/220a82/000000?text=+) `primary`
 - ![#e535ab](https://placehold.it/15/e535ab/000000?text=+) `secondary`
 - ![#009f97](https://placehold.it/15/009f97/000000?text=+) `tertiary`
 - ![#d8d9e0](https://placehold.it/15/d8d9e0/000000?text=+) `divider`
 - ![#f7f8fa](https://placehold.it/15/f7f8fa/000000?text=+) `background`
 - ![#343c5a](https://placehold.it/15/343c5a/000000?text=+) `text1`
 - ![#747790](https://placehold.it/15/747790/000000?text=+) `text2`
 - ![#9496aa](https://placehold.it/15/9496aa/000000?text=+) `text3`
 - ![#afb1c0](https://placehold.it/15/afb1c0/000000?text=+) `text4`
