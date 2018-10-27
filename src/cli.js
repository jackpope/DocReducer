#!/usr/bin/env node

// const state = require("./state.js").init(),
//     requestDir = require("./github_pull.js");


// const init = function() {
//     state.getState().directories.forEach(dir => requestDir(dir));
// }

const findFiles = require('./find_files.js');
const writeFiles = require('./write_files.js');

(() => {
  // TODO: first step should be 'validate config' -> pass config to pullFiles()
  findFiles()
    .then(writeFiles)
    .catch(e => console.log('ERROR:', e));
})();
