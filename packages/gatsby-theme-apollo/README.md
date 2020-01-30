# gatsby-theme-apollo

A Gatsby theme that sets up your website for use with [Apollo Client](https://www.apollographql.com/docs/react/v3.0-beta).

## Installation

This theme is meant to be used with the `@apollo/client` package. If you aren't already using it, make sure you install it along with this theme.

```bash
$ npm install gatsby-theme-apollo
```

## Usage

Add `gatsby-theme-apollo` as a plugin in your Gatsby config.

```js
// gatsby-config.js
module.exports = {
  plugins: ['gatsby-theme-apollo']
};
```

**Required:** [Shadow](https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/) this theme's `client.js` file with your own Apollo client. Check out the Apollo docs to learn more about [creating a client](https://www.apollographql.com/docs/react/v3.0-beta/essentials/get-started/#create-a-client).

However you decide to create your client, you should make sure that:

1. You provide an isomorphic `fetch` implementation as a configuration option
2. Your client is the default export in `client.js`

```js
// src/gatsby-theme-apollo/client.js
import fetch from 'isomorphic-fetch';
import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://api.spacex.land/graphql/',
    fetch
  })
});

export default client;
```

## License

[MIT](../../LICENSE)
