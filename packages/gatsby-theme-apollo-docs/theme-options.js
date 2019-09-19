const navItems = [
  {
    url: 'https://www.apollographql.com/docs',
    title: 'Apollo Basics',
    description:
      'Learn about each part of the Apollo platform and how they all work together.'
  },
  {
    url: 'https://www.apollographql.com/docs/apollo-server',
    title: 'Apollo Server',
    description:
      'Configure a production-ready GraphQL server to fetch and combine data from multiple sources.'
  },
  {
    url: 'https://www.apollographql.com/docs/react',
    title: 'Apollo Client (React)',
    description:
      "Manage the entirety of your React app's state and seamlessly execute GraphQL operations."
  },
  {
    url: 'https://www.apollographql.com/docs/graph-manager',
    title: 'Apollo Graph Manager',
    description:
      "Integrate with Apollo's cloud service for schema versioning, metrics, and enhanced security."
  },
  {
    url: 'https://www.apollographql.com/docs/ios',
    title: 'Apollo Client (iOS)',
    description:
      "Manage the entirety of your iOS app's state and seamlessly execute GraphQL operations."
  },
  {
    url: 'https://www.apollographql.com/docs/link',
    title: 'Apollo Link',
    description:
      'Define a custom chain of actions that your client performs with each GraphQL operation.'
  }
];

const footerNavItems = [
  {
    text: 'Blog',
    href: 'https://blog.apollographql.com/',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  {
    text: 'Contribute',
    href: 'https://www.apollographql.com/docs/community/'
  },
  {
    text: 'GraphQL Summit',
    href: 'https://summit.graphql.com/',
    target: '_blank',
    rel: 'noopener noreferrer'
  }
];

module.exports = {
  siteName: 'Apollo Docs',
  menuTitle: 'Apollo Platform',
  trackingId: 'UA-74643563-13',
  algoliaApiKey: '768e823959d35bbd51e4b2439be13fb7',
  algoliaIndexName: 'apollodata',
  baseUrl: 'https://www.apollographql.com',
  twitterHandle: 'apollographql',
  spectrumHandle: 'apollo',
  youtubeUrl: 'https://www.youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw',
  logoLink: 'https://www.apollographql.com/docs/',
  navItems,
  footerNavItems
};
