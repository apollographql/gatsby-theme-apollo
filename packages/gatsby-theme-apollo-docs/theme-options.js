const navConfig = {
  '/docs': {
    text: 'Platform',
    matchRegex: /^\/docs\/(intro|platform|resources|references|$)/
  },
  '/docs/tutorial/introduction': {
    text: 'Tutorial',
    matchRegex: /^\/docs\/tutorial/
  },
  '/docs/react': {
    text: 'Client',
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
  '/docs/apollo-server': {
    text: 'Server',
    subpages: {
      '/docs/apollo-server': 'Apollo Server',
      '/docs/graphql-tools': 'graphql-tools',
      '/docs/graphql-subscriptions': 'GraphQL subscriptions'
    }
  },
  '/docs/community': {
    text: 'Community',
    subpages: {
      'https://blog.apollographql.com': 'Blog',
      'https://spectrum.chat/apollo': 'Spectrum',
      'https://twitter.com/apollographql': 'Twitter',
      'https://youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw': 'YouTube',
      '/docs/community': 'Contribute',
      'https://summit.graphql.com': 'GraphQL Summit',
      'https://graphql.com': 'Explore GraphQL'
    }
  }
};

module.exports = {
  siteName: 'Apollo Docs',
  trackingId: 'UA-74643563-13',
  algoliaApiKey: '768e823959d35bbd51e4b2439be13fb7',
  algoliaIndexName: 'apollodata',
  baseUrl: 'https://www.apollographql.com',
  navConfig
};
