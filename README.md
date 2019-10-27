# DocReducer [![Actions Status](https://github.com/jackpope/DocReducer/workflows/Build%2C%20test%2C%20and%20release/badge.svg?branch=master)](https://github.com/jackpope/DocReducer/actions)

DocReducer is a Github documentation consolidation CLI tool. It pairs nicely with Vuepress doc sites, with helpers specifically for VuePress config, but could be used to conslidate documentation anywhere.

* DocReducer allows you to specify **repos across various orgs**, with various doc directories and custom README names.
* DocReducer **helps resolve links** by transforming relative links that point outside of the doc directory to absolute links. It will also transform absolute links to other repos or docs into relative links so you can stay within the same documentation site whenever possible.
* DocReducer generates missing README files in each documentation subdirectory to make sure doc site builders have reliable index pages.
* DocReducer **provides helpers for Vuepress site configuration** to make building your new documentation site quick and easy.

## Using with a Vuepress site

### Setup and sync documents

1. `yarn init`
2. `yarn add vuepress doc-reducer`
3. `touch doc-reducer.json`
4. Add configuration to `doc-reducer.json` ([Example](./doc-reducer-example.json))
5. Make sure `GITHUB_TOKEN` and `GITHUB_USERNAME` env vars are available and have access to the repos added to `doc-reducer.json`
6. `yarn doc-reducer`
7. `yarn vuepress dev <doc desitination directory>`

### Vuepress helpers

In addition to the document consolidation script, this package also exports helpers to configure your Vuepress site.

#### navLinksGenerator

Within your `.vuepress/config.js` file, use `navLinksGenerator` to add a Nav dropdown with an option for each repo you've synced by providing their base path.

Example:

```javascript
const docReducer = require("doc-reducer");

module.exports = {
  title: "Site name",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Apps",
        items: docReducer.navLinksGenerator("/apps")
      }
    ]
  }
};
```

#### sidebarLinksGenerator

Within your `.vuepress/config.js` file, use `sidebarLinksGenerator` to add a sidebar with items for each repo and their headers. Provide the root location for your Vuepress content and the base path for the synced content.

Example:

```javascript
const docReducer = require("doc-reducer");

module.exports = {
  title: "Site name",
  themeConfig: {
    sidebar: {
      ...docReducer.sidebarLinksGenerator("docs", "apps"),
      "/": ["apps/"]
    }
  }
};
```

## Development

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

You should have Node v12 and yarn installed on your system.

```
yarn install
yarn test
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/jackpope/DocReducer/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
