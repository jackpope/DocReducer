#!/usr/bin/env node

"use strict";

const fs = require("fs"),
  requestSource = require("./github_pull.js"),
  configData = JSON.parse(
    fs.readFileSync(process.cwd() + "/doc-reducer.json", "utf8")
  );


const init = function() {
    configData.sources.forEach(source => requestSource(source));
}

init();
