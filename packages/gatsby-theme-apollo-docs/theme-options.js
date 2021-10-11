const {colors} = require('gatsby-theme-apollo-core/src/utils/colors');

const navConfig = {
  'Apollo Basics': {
    category: 'Core',
    url: 'https://www.apollographql.com/docs',
    description:
      'Learn about each part of the Apollo platform and how they all work together.',
    omitLandingPage: true
  },
  'Apollo Client (React)': {
    docset: 'react',
    category: 'Apollo Client',
    shortName: 'React / JS',
    url: 'https://www.apollographql.com/docs/react',
    description:
      "Manage your React app's state and seamlessly execute GraphQL operations.",
    topArticles: [
      {
        title: 'Get started',
        url: 'https://www.apollographql.com/docs/react/get-started/'
      },
      {
        title: 'Queries',
        url: 'https://www.apollographql.com/docs/react/data/queries/'
      },
      {
        title: 'Caching overview',
        url: 'https://www.apollographql.com/docs/react/caching/overview/'
      }
    ]
  },
  'Apollo Client (iOS)': {
    docset: 'ios',
    category: 'Apollo Client',
    shortName: 'iOS',
    url: 'https://www.apollographql.com/docs/ios',
    description:
      "Manage your iOS app's state and seamlessly execute GraphQL operations.",
    topArticles: [
      {
        title: 'Tutorial',
        url: 'https://www.apollographql.com/docs/ios/tutorial/tutorial-introduction/'
      },
      {
        title: 'Downloading a schema',
        url: 'https://www.apollographql.com/docs/ios/downloading-schema/'
      },
      {
        title: 'Fetching queries',
        url: 'https://www.apollographql.com/docs/ios/fetching-queries/'
      }
    ]
  },
  'Apollo Client (Android)': {
    docset: 'android',
    category: 'Apollo Client',
    shortName: 'Android',
    url: 'https://www.apollographql.com/docs/android',
    description:
      "Manage your Android app's state and seamlessly execute GraphQL operations.",
    topArticles: [
      {
        title: 'Tutorial',
        url: 'https://www.apollographql.com/docs/android/tutorial/00-introduction/'
      },
      {
        title: 'Queries',
        url: 'https://www.apollographql.com/docs/android/essentials/queries/'
      },
      {
        title: 'Normalized cache',
        url: 'https://www.apollographql.com/docs/android/essentials/normalized-cache/'
      }
    ]
  },
  'Apollo Server': {
    docset: 'apollo-server',
    category: 'Backend',
    url: 'https://www.apollographql.com/docs/apollo-server',
    description:
      'Configure a production-ready GraphQL server to fetch and combine data from multiple sources.',
    topArticles: [
      {
        title: 'Get started',
        url: 'https://www.apollographql.com/docs/apollo-server/getting-started/'
      },
      {
        title: 'Schema basics',
        url: 'https://www.apollographql.com/docs/apollo-server/schema/schema/'
      },
      {
        title: 'Resolvers',
        url: 'https://www.apollographql.com/docs/apollo-server/data/resolvers/'
      }
    ]
  },
  'Apollo Federation': {
    docset: 'federation',
    category: 'Backend',
    url: 'https://www.apollographql.com/docs/federation',
    description: 'Implement a single unified graph across multiple subgraphs.',
    topArticles: [
      {
        title: 'Introduction',
        url: 'https://www.apollographql.com/docs/federation/'
      },
      {
        title: 'Quickstart',
        url: 'https://www.apollographql.com/docs/federation/quickstart/'
      },
      {
        title: 'Enterprise guide',
        url: 'https://www.apollographql.com/docs/federation/enterprise-guide/introduction/'
      }
    ]
  },
  'Apollo Studio': {
    docset: 'studio',
    category: 'Tools',
    url: 'https://www.apollographql.com/docs/graph-manager',
    description:
      'Build your graph with your team, evolve it safely, and keep it running smoothly.',
    topArticles: [
      {
        title: 'Get started',
        url: 'https://www.apollographql.com/docs/studio/getting-started/'
      },
      {
        title: 'Metrics reporting',
        url: 'https://www.apollographql.com/docs/studio/setup-analytics/'
      },
      {
        title: 'Schema checks',
        url: 'https://www.apollographql.com/docs/studio/schema-checks/'
      }
    ]
  },
  'Rover CLI': {
    docset: 'rover',
    category: 'Tools',
    url: 'https://www.apollographql.com/docs/rover',
    description: 'Manage your Studio graphs and schemas from the command line.',
    topArticles: [
      {
        title: 'Install',
        url: 'https://www.apollographql.com/docs/rover/getting-started'
      },
      {
        title: 'Configure',
        url: 'https://www.apollographql.com/docs/rover/configuring/'
      },
      {
        title: 'Working with graphs',
        url: 'https://www.apollographql.com/docs/rover/graphs/'
      }
    ]
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

const mermaidOptions = {
  themeCSS: `
    .node rect,
    .node circle,
    .node polygon,
    .node path {
      stroke-width: 2px;
      stroke: ${colors.primary};
      fill: ${colors.background};
    }
    .node.secondary rect,
    .node.secondary circle,
    .node.secondary polygon,
    .node.tertiary rect,
    .node.tertiary circle,
    .node.tertiary polygon {
      fill: white;
    }
    .node.secondary rect,
    .node.secondary circle,
    .node.secondary polygon {
      stroke: ${colors.secondary};
    }
    .cluster rect,
    .node.tertiary rect,
    .node.tertiary circle,
    .node.tertiary polygon {
      stroke: ${colors.tertiary};
    }
    .cluster rect {
      fill: none;
      stroke-width: 2px;
    }
    .label, .edgeLabel {
      background-color: white;
      line-height: 1.3;
    }
    .edgeLabel rect {
      background: none;
      fill: none;
    }
    .messageText, .noteText, .loopText {
      font-size: 12px;
      stroke: none;
    }
    g rect, polygon.labelBox {
      stroke-width: 2px;
    }
    g rect.actor {
      stroke: ${colors.tertiary};
      fill: white;
    }
    g rect.note {
      stroke: ${colors.secondary};
      fill: white;
    }
    g line.loopLine, polygon.labelBox {
      stroke: ${colors.primary};
      fill: white;
    }
  `
};

module.exports = {
  siteName: 'Apollo Docs',
  pageTitle: 'Apollo GraphQL Docs',
  menuTitle: 'Apollo Platform',
  gaTrackingId: ['UA-74643563-13', 'G-0BGG5V2W2K'],
  gtmContainerId: 'GTM-M964NS9',
  baseUrl: 'https://www.apollographql.com',
  twitterHandle: 'apollographql',
  algoliaAppId: process.env.ALGOLIA_APP_ID,
  algoliaWriteKey: process.env.ALGOLIA_WRITE_KEY,
  algoliaSearchKey: process.env.ALGOLIA_SEARCH_KEY,
  gaViewId: '163147389',
  youtubeUrl: 'https://www.youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw',
  logoLink: 'https://www.apollographql.com/docs/',
  baseDir: 'docs',
  contentDir: 'source',
  navConfig,
  footerNavConfig,
  ffWidgetId: '3131c43c-bfb5-44e6-9a72-b4094f7ec028',
  shareImageConfig,
  oneTrust: true,
  mermaidOptions
};
