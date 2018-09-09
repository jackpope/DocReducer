#!/usr/bin/env node

"use strict";

const state = require("./state.js").init(),
    requestDir = require("./github_pull.js");


const init = function() {
    state.getState().directories.forEach(dir => requestDir(dir));
}

init();
