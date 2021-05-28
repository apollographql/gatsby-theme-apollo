const root = __dirname;
//See gatsby-theme-apollo-docs/themeOptions.js for a more comprehensive list
module.exports = {
    plugins: [
        {
            //use the gatsby apollo theme
            resolve: 'gatsby-theme-apollo-docs',
            options: {
                //root is mandatory.
                root,
                siteName: 'Hello world',
                description: "An example of how to set up Apollo's documentation theme",
                sidebarCategories: {
                    //Null is an alias for index page.
                    null: ['index'],
                    More: ['other', 'dummy']
                }
            }
        }
    ]
};
