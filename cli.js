#!/usr/bin/env node

"use strict";

// Get provided args
const [,, ...args] = process.argv;

// TODO: get these source from a local file?
// const source = {
//   org: "contently",
//   repo: "contently",
//   dir: "/doc"
// };
// TODO: get this destination from CLI args
const destination = "/tmp/collected_docs/"

const request = require("request"),
    fs = require('fs');

const headers = {
    "Authorization": `token ${process.env.GITHUB_TOKEN}`,
    "Accept": "application/vnd.github.v3.raw",
    "User-Agent": "jackpope"
};
const directoryRequest = {
    url: "https://api.github.com/repos/contently/contently/contents/doc",
    headers: headers
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
const directoryCallback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
        const filesToDownload = JSON.parse(body).map((doc) => ({ name: doc.name, url: doc.download_url }));
        filesToDownload.forEach((file) => pullFile(file));
    } else {
        console.log(response.statusCode);
  } ;
};

request(directoryRequest, directoryCallback);
