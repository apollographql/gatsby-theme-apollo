module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-apollo-docs',
      options: {
        // see gatsby-theme-apollo-docs readme for a comprehensive list of options
        root: __dirname, // root is mandatory
        siteName: 'Not an Apollo site',
        description: "An example of how to set up Apollo's documentation theme",
        sidebarCategories: {
          // null is used to render top-level (no category) pages
          null: ['index'],
          More: ['other', 'dummy']
        }
      }
    }
  ]
};
