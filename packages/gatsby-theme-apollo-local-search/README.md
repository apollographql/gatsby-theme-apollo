# gatsby-theme-apollo-local-search

A Gatsby theme extension that allows local search.

## Installation


```bash
npm install gatsby-theme-apollo-local-search
```

## Usage

Add `gatsby-theme-apollo-local-search` as a plugin in your Gatsby config.  It should
be placed after your Configure content
to match your `contentDir` and `root` to match the same as the gatsby-theme-apollo-docs.

```js
// gatsby-config.js
const root = __dirname;
const contentDir = 'content';

module.exports = {
  plugins: [{
      resolve: 'gatsby-theme-apollo-docs',
      options: { ...your_options, root, contentDir  },
   },
   {
      resolve:'gatsby-theme-apollo-local-search',
      options:{root, contentDir}
   }]
};
```
