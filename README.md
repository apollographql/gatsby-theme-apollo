<img align="right" width="200" src="https://i.imgur.com/6QsMJfS.png">

# Apollo Gatsby Themes

This repo contains [Gatsby](https://gatsbyjs.org) themes that make it easy to create new websites at Apollo. In its most basic implementation, the theme provides a CSS reset, styles for regular HTML elements (`h1`, `h2`, `p`, `li`, etc.), and a handful of useful layout components.

## Packages

- [`gatsby-theme-apollo`](./packages/gatsby-theme-apollo)
- [`gatsby-theme-apollo-docs`](./packages/gatsby-theme-apollo-docs)

## Basic usage

First, install `gatsby` and the theme that you want to use. This example will be using the base theme, `gatsby-theme-apollo`.

```bash
$ npm install gatsby gatsby-theme-apollo
```

Using a Gatsby theme is really easy! Simply configure your theme under the `__experimentalThemes` property in your Gatsby config. The only required option here is `root`, which should always be `__dirname`. It's also a good idea to give your site a `title` and `description`, as defined under the `siteMetadata` property in the config.

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
    title: 'My great website',
    description: 'A simple Gatsby theme example'
  }
};
```

Now add some React components to your _src/pages_ directory, and you're off to the races! More info about creating pages in Gatsby [here](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/). Here's an example page:

```js
// src/pages/index.js
import React from 'react';
import {Layout, LogoTitle} from 'gatsby-theme-apollo';

export default function Home() {
  return (
    <Layout>
      <LogoTitle />
      I love themes!
    </Layout>
  );
}
```

As you can see, the page is wrapped in a `Layout` component and contains a `LogoTitle`, both coming from `gatsby-theme-apollo`. Our base theme has a bunch of useful shared components like these, and they're all documented [in the base theme](./packages/gatsby-theme-apollo).

## Deploying to a subdirectory

In order to deploy a Gatsby site to a subdirectory, there are a few extra steps to take. First, you must provide a `pathPrefix` property in your Gatsby config. This option combined with the `--prefix-paths` option in the Gatsby CLI will handle most of the hard work. Read more about path prefixing in Gatsby [here](https://www.gatsbyjs.org/docs/path-prefix/).

```js
// gatsby-config.js
module.exports = {
  ...
  pathPrefix: '/YOUR_PATH_PREFIX'
};
```

Now, when you run `npx gatsby bulid --prefix-paths`, all pages, references to static assets, and links between pages will be prefixed with your custom path. That means that if you made a page with the path _/about_, it will live at _/**YOUR_PATH_PREFIX**/about_. In order for this to work within our server configuration, your website files also must exist in a directory with the same name. Here's how this sequence of events would look if you ran commands in your terminal:

```bash
$ npx gatsby build --prefix-paths
$ mkdir -p YOUR_PATH_PREFIX
$ mv public/* YOUR_PATH_PREFIX
$ mv YOUR_PATH_PREFIX public/
```

We use [Netlify](https://netlify.com) to deploy our websites, so to express this slightly more complicated build process to them, create a _netlify.toml_ file that follows this pattern:

```toml
# netlify.toml
[build]
  base = "/"
  publish = "public/"
  command = "gatsby build --prefix-paths && mkdir -p YOUR_PATH_PREFIX && mv public/* YOUR_PATH_PREFIX && mv YOUR_PATH_PREFIX public/"
```

We use [Fly](https://fly.io) to manage our server rewrites and redirects. To point your new Netlify deployment to a page on apollographql.com, first [create a new backend](https://fly.io/sites/www-apollodata-com/backends) using your site's Netlify alias. Next, you'll need to [add _two_ rewrite rules](https://fly.io/sites/www-apollodata-com/rules):

- `/YOUR_PATH_PREFIX/:page` ➡️ `/YOUR_PATH_PREFIX/$page`
- `/YOUR_PATH_PREFIX` ➡️ `/YOUR_PATH_PREFIX`

Be sure to set the priority of each of these rules to `3`, or a value lower than the top two redirect rules that apply to our website root. Once these rewrite rules take effect, your site will be live at _https://apollographql.com/YOUR_PATH_PREFIX_.
