#!/usr/bin/env node

const loadConfig = require('./load_config.js');
const findFiles = require('./find_files.js');
const downloadFiles = require('./download_files.js');
const logger = require('./logger.js');

(() => {
  logger.progress.init(0, 'Downloading documents');
  loadConfig()
    .then(findFiles)
    .then(downloadFiles)
    .then('ALL FINISHED :)')
    .catch(e => console.log('ERROR:', e));
})();
