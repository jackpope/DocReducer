#!/usr/bin/env node

const findFiles = require('./find_files.js');
const downloadFiles = require('./download_files.js');
const addReadmes = require('./add_readmes.js');
const addAttribution = require('./add_attribution.js');

(() => {
  findFiles()
    .then(downloadFiles)
    .then(addReadmes)
    .then(addAttribution)
    .catch(e => console.log('ERROR:', e));
})();
