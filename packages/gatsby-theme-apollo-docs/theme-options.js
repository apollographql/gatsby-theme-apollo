const navConfig = {
  'https://www.apollographql.com/docs': {
    text: 'Get Started',
    description:
      'Learn about each part of the Apollo platform and how they all work together.'
  },
  'https://www.apollographql.com/docs/apollo-server': {
    text: 'Apollo Server',
    description:
      'Configure a production-ready GraphQL server to fetch and combine data from multiple sources.'
  },
  'https://www.apollographql.com/docs/react': {
    text: 'Apollo Client (React)',
    description:
      "Manage the entirety of your React app's state and seamlessly execute GraphQL operations."
  },
  'https://www.apollographql.com/docs/platform': {
    text: 'Apollo Graph Manager',
    description:
      "Integrate with Apollo's cloud service for schema versioning, metrics, and enhanced security."
  },
  'https://www.apollographql.com/docs/ios': {
    text: 'Apollo Client (iOS)',
    description:
      "Manage the entirety of your iOS app's state and seamlessly execute GraphQL operations."
  },
  'https://www.apollographql.com/docs/link': {
    text: 'Apollo Link',
    description:
      'Define a custom chain of actions that your client performs with each GraphQL operation.'
  }
};

module.exports = {
  siteName: 'Apollo Docs',
  trackingId: 'UA-74643563-13',
  algoliaApiKey: '768e823959d35bbd51e4b2439be13fb7',
  algoliaIndexName: 'apollodata',
  baseUrl: 'https://www.apollographql.com',
  twitterHandle: 'apollographql',
  logoLink: 'https://www.apollographql.com/docs/',
  navConfig
};
