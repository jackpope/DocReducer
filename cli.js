#!/usr/bin/env node

"use strict";

// Get provided args
const [,, ...args] = process.argv;

const configData = {
    sources: [
        {
            org: "contently",
            repo: "contently",
            directories: [
                "doc"
            ]
        }

    ]
}

// TODO: get this destination from CLI args
const destination = "/tmp/collected_docs/"

const request = require("request"),
    fs = require('fs');

const headers = {
    "Authorization": `token ${process.env.GITHUB_TOKEN}`,
    "Accept": "application/vnd.github.v3.raw",
    "User-Agent": "jackpope"
};
const writeFile = function(file) {
    const dir = __dirname + destination,
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
const pullFile = function(file) {
    request({url: file.url, headers: headers}, function(error, response, body) {
        file.contents = body;
        writeFile(file);
    });
};
const sourceCallback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
        const filesToDownload = JSON.parse(body).map((doc) => ({ name: doc.name, url: doc.download_url }));
        filesToDownload.forEach((file) => pullFile(file));
    } else {
        console.log(response.statusCode);
  } ;
};

const pullSource = function(source) {
    source.directories.forEach((dir) => {
        const requestData = {
            url: `https://api.github.com/repos/${source.org}/${source.repo}/contents/${dir}`,
            headers: headers
        }
        request(requestData, sourceCallback);
    });
}

const init = function() {
    configData.sources.forEach(source => pullSource(source));
}

init();
