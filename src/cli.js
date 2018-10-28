#!/usr/bin/env node

const loadConfig = require('./load_config.js');
const findFiles = require('./find_files.js');
const downloadFiles = require('./download_files.js');
const addReadmes = require('./add_readmes.js');

(() => {
  loadConfig()
    .then(findFiles)
    .then(downloadFiles)
    .then(addReadmes)
    // .then(updateLinks)
    // .then(addAttribution)
    .then(_=> console.log('ALL FINISHED :)'))
    .catch(e => console.log('ERROR:', e));
})();
