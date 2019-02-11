## Using themes

*gatsby-config.js*

```js
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

## Deploying

To deploy a Gatsby site into a subdirectory, there are a few extra things to do:

*gatsby-config.js*

```js
module.exports = {
  // ...rest of your config
  pathPrefix: '/your-path-prefix'
};
```

*netlify.toml*

```toml
[build]
  base = "/"
  publish = "public/"
  command = "gatsby build --prefix-paths && mkdir -p your-path-prefix && mv public/* your-path-prefix && mv your-path-prefix public/"
```

In fly.io, set up two rules:

- /your-path-prefix/:page -> /your-path-prefix/$page
- /your-path-prefix -> /your-path-prefix
