# DocReducer

## Consolidate documentation across many Github repos with a VuePress site

### Usage:

#### Using yarn

In a new project directory...

1. `yarn init`
2. `yarn add vuepress doc-reducer`
3. `touch doc-reducer.json`
4. Add configuration to `doc-reducer.json` ([Example](./doc-reducer-example.json))
5. `yarn doc-reducer`
6. `yarn vuepress dev <doc desitination directory>`

### Flow

- Fetch all files for directory on github repo
- For each file
  - Download file to disk
  - Log file
  - Add file to index README for the repo
