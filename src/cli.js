#!/usr/bin/env node

/* eslint-disable no-console */

const findFiles = require('./find_files.js');
const downloadFiles = require('./download_files.js');
const addReadmes = require('./add_readmes.js');
const addAttribution = require('./add_attribution.js');
// const resolveLinks = require("./resolve_links.js");

(() => {
  findFiles()
    .then(downloadFiles)
    .then(addReadmes)
    .then(addAttribution)
    .catch(e => console.log('ERROR:', e));
})();
