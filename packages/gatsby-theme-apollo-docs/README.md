# gatsby-theme-apollo-docs

This is an entirely configuration-based Gatsby theme that generates a documentation website based on a series of markdown files.

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
  - [sidebarCategories](#sidebarcategories)
- [Creating pages](#creating-pages)
- [Older versions](#older-versions)
- [Deployment](#deployment)

## Installation

```bash
$ npm install gatsby gatsby-theme-apollo-docs
```

## Configuration

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
| contentDir        | string | The directory, relative to the _gatsby-config.js_ file, where the markdown files live |
| basePath          | string | The path, relative to _https://apollographql.com_, where the website will be hosted   |
| sidebarCategories | object | An object mapping categories to page paths ([described below](#sidebarCategories))    |

### sidebarCategories

The `sidebarCategories` option is an object keyed by category titles. Each entry in the object is an array of page paths. The path should resemble the location of a markdown file in the git repository, relative to the directory specified by the `contentDir` theme option, and without the _.md_ extension. Sidebar navigation items that are **not** a member of a category live under the `null` key.

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

## Creating pages

Create markdown files in your `contentDir` (typically _source_) to generate pages. Your markdown files should contain some frontmatter defining their titles and descriptions.

```markdown
---
title: Introduction
description: What is Apollo Server and what does it do?
---

Apollo Server is the best way to quickly build a production-ready, self-documenting API for GraphQL clients, using data from any source.
```

Page URLs will be derived from the file paths of your markdown. You can nest markdown files within directories to create pages with additional path segments.

## Older versions

This theme uses [`simple-git`](https://github.com/steveukx/git-js) to look for older versions of documentation and create pages for them. If no _gatsby-config.js_ is found in the docs directory of an older version, its existing Hexo config will be used to configure its `sidebarCategories`. Only one set of documentation will be generated per major version, based on its latest published tag.

## Deployment

All docs sites will eventually be deployed into a subdirectory, as configured by the `basePath` option&mdash;https://apollographql.com/docs/apollo-server, for example. [Read this guide](https://github.com/apollographql/gatsby-theme-apollo#deploying-to-a-subdirectory) to learn how to pull this off.
