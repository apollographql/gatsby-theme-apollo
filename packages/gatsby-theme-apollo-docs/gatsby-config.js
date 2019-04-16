module.exports = ({subtitle, description, basePath, spectrumPath, root}) => {
  const config = {
    __experimentalThemes: [
      {
        resolve: 'gatsby-theme-apollo',
        options: {
          root
        }
      }
    ],
    pathPrefix: basePath,
    siteMetadata: {
      title: 'Apollo Docs',
      subtitle,
      description,
      basePath,
      spectrumPath
    },
    plugins: [
      'gatsby-plugin-less',
      {
        resolve: 'gatsby-plugin-google-analytics',
        options: {
          trackingId: 'UA-74643563-13'
        }
      }
    ]
  };

  if (process.env.NODE_ENV === 'development') {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        {
          resolve: 'gatsby-source-filesystem',
          options: {
            path: `${root}/source`,
            name: 'pages'
          }
        }
      ]
    };
  }

  return config;
};
