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

| Option name       | Type   | Description                                                                           |
| ----------------- | ------ | ------------------------------------------------------------------------------------- |
| root              | string | Must be `__dirname`                                                                   |
| subtitle          | string | The title that gets rendered above the sidebar navigation                             |
| description       | string | The site description for SEO and social (FB, Twitter) tags                            |
| contentDir        | string | The directory (relative to the _gatsby-config.js_ file) where the markdown files live |
| basePath          | string | The path (relative to _https://apollographql.com_) where the website will be hosted   |
| sidebarCategories | object | An object mapping categories to page paths (described below)                          |

### sidebarCategories

The `sidebarCategories` option is an object keyed by category titles. Each entry in the object is an array of page paths. The path should resemble the location of a markdown file in the git repository, relative to the directory specified by the `contentDir` theme option. Sidebar navigation items that are **not** a member of a category live under the `null` key.

```js
{
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
```

## Deployment

All docs sites will eventually be deployed into a subdirectory, as configured by the `basePath` option&mdash;_https://apollographql.com/**docs/apollo-server**_, for example. [Read this guide](https://github.com/apollographql/gatsby-theme-apollo#deploying-to-a-subdirectory) to learn how to pull this off.
