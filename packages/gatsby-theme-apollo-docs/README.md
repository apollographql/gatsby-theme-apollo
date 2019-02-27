# gatsby-theme-apollo-docs

This is an entirely configuration-based Gatsby theme that generates a documentation website based on a series of markdown files.

## Installation

```bash
$ npm install gatsby gatsby-theme-apollo-docs
```

## Usage

```js
// gatsby-config.js
module.exports = {
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-apollo-docs',
      options: {
        root: __dirname,
        subtitle: 'Apollo Server',
        description: 'A guide to using Apollo Server',
        contentDir: 'source',
        basePath: '/docs/apollo-server',
        sidebarCategories: {
          null: [
            'index',
            'getting-started',
            'whats-new'
          ],
          Features: [
            'features/mocking',
            'features/errors',
            'features/data-sources'
          ]
        }
      }
    }
  ]
};
```
