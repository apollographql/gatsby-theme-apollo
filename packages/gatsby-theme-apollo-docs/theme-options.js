const navConfig = {
  '/docs': {
    text: 'Home',
    description:
      'Learn about the Apollo Platform; an implementation of GraphQL to manage data from the cloud to your UI.',
    matchRegex:
      '^/docs/(?!(tutorial|react|angular|link|ios|android|scalajs|apollo-server|graphql-tools|graphql-subscriptions|community))'
  },
  '/docs/apollo-server': {
    text: 'Server',
    description:
      'Quickly build a production-ready, self-documenting API for GraphQL clients, using data from any source.',
    subpages: {
      '/docs/apollo-server': 'Apollo Server',
      '/docs/graphql-tools': 'graphql-tools',
      '/docs/graphql-subscriptions': 'GraphQL subscriptions'
    }
  },
  '/docs/react': {
    text: 'Client (React)',
    description:
      'A complete Javascript library that takes care of requesting and caching your data, as well as updating your UI.',
    subpages: {
      '/docs/react': 'React + React Native',
      '/docs/angular': 'Angular',
      'https://github.com/akryum/vue-apollo': 'Vue.js',
      '/docs/link': 'Apollo Link',
      '/docs/ios': 'Native iOS',
      '/docs/android': 'Native Android',
      '/docs/scalajs': 'Scala.js'
    }
  },
  '/docs/platform/graph-manager-overview': {
    text: 'Graph Manager',
    description:
      'A guide to our cloud service for schema management and performance metrics monitoring.'
  },
  '/docs/ios': {
    text: 'Client (iOS)',
    description:
      'A strongly-typed, caching GraphQL client for native iOS apps, written in Swift.'
  },
  '/docs/link': {
    text: 'Link',
    description:
      'Designed to be a powerful way to compose actions around data handling with GraphQL.'
  }
  // '/docs/community': {
  //   text: 'Community',
  //   subpages: {
  //     'https://blog.apollographql.com': 'Blog',
  //     'https://spectrum.chat/apollo': 'Spectrum',
  //     'https://twitter.com/apollographql': 'Twitter',
  //     'https://youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw': 'YouTube',
  //     '/docs/community': 'Contribute',
  //     'https://summit.graphql.com': 'GraphQL Summit',
  //     'https://graphql.com': 'Explore GraphQL'
  //   }
  // },
  // '/docs/tutorial/introduction': {
  //   text: 'Tutorial',
  //   matchRegex: '^/docs/tutorial'
  // }
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
