#!/usr/bin/env node

"use strict";

const fs = require('fs'),
    requestSource = require('./github_pull.js');

// Get provided args
const [,, ...args] = process.argv;
const cwd = process.cwd();
const configData = JSON.parse(fs.readFileSync(cwd + "/doc-reducer.json", "utf8"));

// TODO: get this destination from CLI args
const destination = "/tmp/collected_docs/"

const requestFileCallback = function(file) {
    const dir = cwd + destination,
        filePath = dir + file.name;

    if (fs.existsSync(dir)) {
        fs.writeFile(filePath, file.contents, function (err) {
            if (err) {
                console.log(err);
                return false;
            }

            console.log(`Saved: ${file.name}`);
        });
    } else {
        console.log("Destination path does not exist.")
        return false;
    }
};

const init = function() {
    configData.sources.forEach(source => requestSource(source, requestFileCallback));
}

init();
