# Example usage of `gatsby-theme-apollo-docs`

This directory is an example project to show how you can use Apollo's docs theme for non-Apollo usage.

## Local development

This project uses yarn workspaces. To spin up this example project locally, run `yarn workspace example start` in the root of the `gatsby-theme-apollo` directory (not inside of this `example` directory).

## Overrides

To replace the logo, create a custom React component in `src/gatsby-theme-apollo-core/components/logo.js`. You can import your own SVG and use styled components to achieve your desired look.

This example removes the header button by supplying a React component that renders nothing at `src/gatsby-theme-apollo-docs/components/header-button.js`.

```js
// this is a "component" that renders nothing
export default () => null;
```
