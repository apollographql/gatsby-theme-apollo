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

## Components

### Layout

```js
import {Layout} from 'gatsby-theme-apollo';
```

This component only takes `children`, but it should be used to wrap every page that gets created. It configures `react-helmet` and sets the meta description tag with data from the `siteMetadata` property in your Gatsby config. It also sets the favicon for the page to the Apollo "A" logo.
