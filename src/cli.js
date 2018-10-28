#!/usr/bin/env node

const loadConfig = require('./load_config.js');
const findFiles = require('./find_files.js');
const downloadFiles = require('./download_files.js');
const addReadmes = require('./add_readmes.js');
const addAttribution = require('./add_attribution.js');

(() => {
  loadConfig()
    .then(findFiles)
    .then(downloadFiles)
    .then(addReadmes)
    .then(addAttribution)
    // .then(updateLinks)
    .then(_=> console.log('ALL FINISHED :)'))
    .catch(e => console.log('ERROR:', e));
})();
