"use strict";

const request = require("request");
const headers = {
    "Authorization": `token ${process.env.GITHUB_TOKEN}`,
    "Accept": "application/vnd.github.v3.raw",
    "User-Agent": "jackpope"
};

const requestFile = function (file, cb) {
    request({ url: file.url, headers: headers }, function (error, response, body) {
        file.contents = body;
        cb(file);
    });
};

const requestSource = function (source, requestFileCallback) {
    source.directories.forEach((dir) => {
        const requestData = {
            url: `https://api.github.com/repos/${source.org}/${source.repo}/contents/${dir}`,
            headers: headers
        }
        request(requestData, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                const filesToDownload = JSON.parse(body).map((doc) => {
                    return ({ name: doc.name, url: doc.download_url });
                });
                filesToDownload.forEach((file) => requestFile(file, requestFileCallback));
            } else {
                console.log(response.statusCode);
            };
        });
    });
};

module.exports = requestSource;
