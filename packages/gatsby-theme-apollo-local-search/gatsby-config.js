const {join, relative} = require('path');
module.exports = ({root, contentDir = 'content'}) => ({
  plugins: [
    // You can have multiple instances of this plugin to create indexes with
    // different names or engines. For example, multi-lingual sites could create
    // an index for each language.
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        // A unique name for the search index. This should be descriptive of
        // what the index contains. This is required.
        name: 'pages',

        // Set the search engine to create the index. This is required.
        // The following engines are supported: flexsearch, lunr
        engine: 'flexsearch',

        // Provide options to the engine. This is optional and only recommended
        // for advanced users.
        //
        // Note: Only the flexsearch engine supports options.
        engineOptions: 'speed',

        // GraphQL query used to fetch all data for the search index. This is
        // required.
        query: `
          {
  allMarkdownRemark {
    nodes {
      excerpt(format: PLAIN, pruneLength: 100, truncate: true)
      id
      fileAbsolutePath
      rawMarkdownBody
      frontmatter {
        description
        subtitle
        title
      }
    }
  }
}
        `,

        // Field used as the reference value for each document.
        // Default: 'id'.
        ref: 'id',

        // List of keys to index. The values of the keys are taken from the
        // normalizer function below.
        // Default: all fields
        index: ['title', 'body'],

        // List of keys to store and make available in your UI. The values of
        // the keys are taken from the normalizer function below.
        // Default: all fields
        store: ['id', 'path', 'title', 'excerpt'],

        // Function used to map the result from the GraphQL query. This should
        // return an array of items to index in the form of flat objects
        // containing properties to index. The objects must contain the `ref`
        // field above (default: 'id'). This is required.
        normalizer({
          data: {
            allMarkdownRemark: {nodes}
          }
        }) {
          //relative to the content.
          const relTo = join(root, contentDir);
          return nodes.map(
            ({
              id,
              frontmatter,
              fileAbsolutePath,
              rawMarkdownBody: body,
              excerpt
            }) => ({
              id,
              body,
              excerpt,
              path: relative(relTo, fileAbsolutePath),
              title: frontmatter && frontmatter.title
            })
          );
        }
      }
    }
  ]
});
