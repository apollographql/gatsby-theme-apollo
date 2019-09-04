const navConfig = {
  'https://www.apollographql.com/docs': {
    text: 'Home',
    description:
      'Learn about the Apollo Platform; an implementation of GraphQL to manage data from the cloud to your UI.'
  },
  'https://www.apollographql.com/docs/apollo-server': {
    text: 'Server',
    description:
      'Quickly build a production-ready, self-documenting API for GraphQL clients, using data from any source.'
  },
  'https://www.apollographql.com/docs/react': {
    text: 'Client (React)',
    description:
      'A complete Javascript library that takes care of requesting and caching your data, as well as updating your UI.'
  },
  'https://www.apollographql.com/docs/platform/graph-manager-overview': {
    text: 'Graph Manager',
    description:
      'A guide to our cloud service for schema management and performance metrics monitoring.'
  },
  'https://www.apollographql.com/docs/ios': {
    text: 'Client (iOS)',
    description:
      'A strongly-typed, caching GraphQL client for native iOS apps, written in Swift.'
  },
  'https://www.apollographql.com/docs/link': {
    text: 'Link',
    description:
      'Designed to be a powerful way to compose actions around data handling with GraphQL.'
  }
};

module.exports = {
  siteName: 'Apollo Docs',
  trackingId: 'UA-74643563-13',
  algoliaApiKey: '768e823959d35bbd51e4b2439be13fb7',
  algoliaIndexName: 'apollodata',
  baseUrl: 'https://www.apollographql.com',
  twitterHandle: 'apollographql',
  navConfig
};
