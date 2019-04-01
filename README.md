# DocReducer

## Consolidate documentation across many Github repos with a VuePress site

<!-- ### Usage:

#### Using yarn

1. `yarn add vuepress doc-reducer -D`
2. `touch doc-reducer.json`
3. Add configuration to `doc-reducer.json`
4. `yarn doc-reducer`
5. `yarn vuepress dev <doc desitination directory>` -->

### Flow

- Fetch all files for directory on github repo
- For each file
  - Download file to disk
  - Log file
  - Add file to index README for the repo
