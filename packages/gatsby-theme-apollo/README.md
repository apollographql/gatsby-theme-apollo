# gatsby-theme-apollo

A Gatsby theme that sets up your website for use with one of Apollo's React libraries.

## Installation

If you're using this theme, you should already have a `@apollo/react-*` libary installed to do the data fetching in your components. We recommend that you use `@apollo/react-hooks`, but you might prefer `@apollo/react-components` or `@apollo/react-hoc`.

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

**Required:** [Shadow](https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/) this theme's `client.js` file with your own Apollo client. This example uses `apollo-boost`, but you can use `apollo-client` if you have a more advanced use case. Check out the Apollo docs to learn more about [creating a client](https://www.apollographql.com/docs/react/essentials/get-started/#create-a-client) or [migrating from Apollo Boost](https://www.apollographql.com/docs/react/advanced/boost-migration/).

However you decide to create your client, please ensure that:

1. You provide an isomorphic `fetch` implementation as a configuration option
2. Your client is the default export in `client.js`

```js
// src/gatsby-theme-apollo/client.js
import ApolloClient from 'apollo-boost';
import fetch from 'isomorphic-fetch';

const client = new ApolloClient({
  fetch,
  uri: 'https://api.spacex.land/graphql/'
});

export default client;
```

## License

[MIT](../../LICENSE)
