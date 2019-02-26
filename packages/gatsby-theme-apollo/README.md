# gatsby-theme-apollo

This is the base theme for building Apollo-branded Gatsby sites. It contains a small amount of configuration, and a handful of components that make it easy to build consistent-looking UIs.

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

The `Layout` should wrap every page that gets created. It configures `react-helmet` and sets the meta description tag with data from the `siteMetadata` property in your Gatsby config. It also sets the favicon for the page to the Apollo "A" logo.

| Prop name | Type | Required |
| --------- | ---- | -------- |
| children  | Node | yes      |

### Header

A sticky header component with a white background and our brand primary, ![#220a82](https://placehold.it/15/220a82/000000?text=+) `#220a82` as the font color.

`MobileHeader` and `DesktopHeader` components are also exported, and can be used to easily render headers with different content depending on the window size.

```js
import {MobileHeader, DesktopHeader} from 'gatsby-theme-apollo';

function MyPage() {
  return (
    <div>
      <MobileHeader>
        This is only shown on mobile
        <HamburgerMenu />
      </MobileHeader>
      <DesktopHeader>
        <Logo />
        This is only shown on desktop
        <HorizontalMenu />
      </DesktopHeader>
    </div>
  );
}
```

| Prop name | Type | Required |
| --------- | ---- | -------- |
| children  | Node | yes      |
