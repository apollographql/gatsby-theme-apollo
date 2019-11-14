const navConfig = {
  'Apollo Basics': {
    url: 'https://www.apollographql.com/docs',
    description:
      'Learn about each part of the Apollo platform and how they all work together.'
  },
  'Apollo Server': {
    url: 'https://www.apollographql.com/docs/apollo-server',
    description:
      'Configure a production-ready GraphQL server to fetch and combine data from multiple sources.'
  },
  'Apollo Client (React)': {
    url: 'https://www.apollographql.com/docs/react',
    description:
      "Manage the entirety of your React app's state and seamlessly execute GraphQL operations."
  },
  'Apollo Graph Manager': {
    url: 'https://www.apollographql.com/docs/graph-manager',
    description:
      "Integrate with Apollo's cloud service for schema versioning, metrics, and enhanced security."
  },
  'Apollo Client (iOS)': {
    url: 'https://www.apollographql.com/docs/ios',
    description:
      "Manage the entirety of your iOS app's state and seamlessly execute GraphQL operations."
  },
  'Apollo Link': {
    url: 'https://www.apollographql.com/docs/link',
    description:
      'Define a custom chain of actions that your client performs with each GraphQL operation.'
  }
};

const footerNavConfig = {
  Blog: {
    href: 'https://blog.apollographql.com/',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  Contribute: {
    href: 'https://www.apollographql.com/docs/community/'
  },
  'GraphQL Summit': {
    href: 'https://summit.graphql.com/',
    target: '_blank',
    rel: 'noopener noreferrer'
  }
};

module.exports = {
  siteName: 'Apollo Docs',
  menuTitle: 'Apollo Platform',
  segmentApiKey: 'wgrIo8Bul0Ujl8USETG3DB6hONdy4kTg',
  algoliaApiKey: '768e823959d35bbd51e4b2439be13fb7',
  algoliaIndexName: 'apollodata',
  baseUrl: 'https://www.apollographql.com',
  twitterHandle: 'apollographql',
  spectrumHandle: 'apollo',
  youtubeUrl: 'https://www.youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw',
  logoLink: 'https://www.apollographql.com/docs/',
  defaultVersion: 'default',
  navConfig,
  footerNavConfig
};
