const navConfig = {
  'Apollo Basics': {
    category: 'Core',
    url: 'https://www.apollographql.com/docs',
    description:
      'Learn about each part of the Apollo platform and how they all work together.',
    omitLandingPage: true
  },
  'Apollo Client (React)': {
    category: 'Apollo Client',
    shortName: 'React / JS',
    url: 'https://www.apollographql.com/docs/react',
    description:
      "Manage the entirety of your React app's state and seamlessly execute GraphQL operations."
  },
  'Apollo Client (iOS)': {
    category: 'Apollo Client',
    shortName: 'iOS',
    url: 'https://www.apollographql.com/docs/ios',
    description:
      "Manage the entirety of your iOS app's state and seamlessly execute GraphQL operations."
  },
  'Apollo Client (Android)': {
    category: 'Apollo Client',
    shortName: 'Android',
    url: 'https://www.apollographql.com/docs/android',
    description:
      "Manage the entirety of your Android app's state and seamlessly execute GraphQL operations."
  },
  'Apollo Server': {
    category: 'Backend',
    url: 'https://www.apollographql.com/docs/apollo-server',
    description:
      'Configure a production-ready GraphQL server to fetch and combine data from multiple sources.'
  },
  'Apollo Federation': {
    category: 'Backend',
    url: 'https://www.apollographql.com/docs/federation',
    description: 'Implement a single data graph across multiple services.'
  },
  'Apollo Studio': {
    category: 'Tools',
    url: 'https://www.apollographql.com/docs/graph-manager',
    description:
      'Build your graph with your team, evolve it safely, and keep it running smoothly.'
  },
  'Rover CLI': {
    category: 'Tools',
    url: 'https://www.apollographql.com/docs/rover',
    description: 'Manage your Studio graphs and schemas from the command line.'
  }
};

const footerNavConfig = {
  Forums: {
    href: 'https://community.apollographql.com/',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  Blog: {
    href: 'https://blog.apollographql.com/',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  Contribute: {
    href: 'https://www.apollographql.com/docs/community/'
  },
  Summit: {
    href: 'https://summit.graphql.com/',
    target: '_blank',
    rel: 'noopener noreferrer'
  }
};

const titleFont = encodeURIComponent('Source Sans Pro');
const shareImageConfig = {
  titleFont,
  titleFontSize: 80,
  titleExtraConfig: '_bold',
  taglineFont: titleFont,
  textColor: 'FFFFFF',
  textLeftOffset: 80,
  textAreaWidth: 1120,
  cloudName: 'apollographql',
  imagePublicID: 'apollo-docs-template2_dohzxt'
};

module.exports = {
  siteName: 'Apollo Docs',
  pageTitle: 'Apollo GraphQL Docs',
  menuTitle: 'Apollo Platform',
  gaTrackingId: ['UA-74643563-13'],
  gtmContainerId: 'GTM-M964NS9',
  algoliaApiKey: '768e823959d35bbd51e4b2439be13fb7',
  algoliaIndexName: 'apollodata',
  baseUrl: 'https://www.apollographql.com',
  twitterHandle: 'apollographql',
  youtubeUrl: 'https://www.youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw',
  logoLink: 'https://www.apollographql.com/docs/',
  baseDir: 'docs',
  contentDir: 'source',
  navConfig,
  footerNavConfig,
  ffWidgetId: '3131c43c-bfb5-44e6-9a72-b4094f7ec028',
  shareImageConfig
};
