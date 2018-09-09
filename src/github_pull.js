"use strict";

const request = require("request"),
    writeFile = require("./write_files.js");
const headers = {
    "Authorization": `token ${process.env.GITHUB_TOKEN}`,
    "Accept": "application/vnd.github.v3.raw",
    "User-Agent": "jackpope"
};

const requestFile = function (file) {
    request({ url: file.url, headers: headers }, function (error, response, body) {
        file.contents = body;
        writeFile(file);
    });
};

const requestDir = function (source, dirName) {
    const requestData = {
        url: `https://api.github.com/repos/${source.org}/${source.repo}/contents/${dirName}`,
        headers: headers
    };
    request(requestData, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const filesToDownload = JSON.parse(body).map((doc) => {
                return {
                    name: doc.name,
                    url: doc.download_url,
                    type: doc.type,
                    path: doc.path,
                    repo: source.repo
                };
            });
            filesToDownload.forEach((file) => {
                if (file.type === "dir") {
                    requestDir(source, file.path);
                } else {
                    requestFile(file);
                }
            });
        } else {
            console.log(requestData.url);
            console.log(response.statusCode);
        };
    });
};

const requestSource = function (source, requestFileCallback) {
    source.directories.forEach((dir) => requestDir(source, dir, requestFileCallback));
};

module.exports = requestSource;
