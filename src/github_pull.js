"use strict";

const request = require("request"),
    state = require("./state.js").init(),
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

const requestDir = function (dir) {
    const requestData = {
        url: `https://api.github.com/repos/${dir.org}/${dir.repo}/contents/${dir.dir}`,
        headers: headers
    };
    request(requestData, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            JSON.parse(body).forEach((doc) => {
                if (doc.type === "dir") {
                    let subDir = Object.assign({}, dir, { dir: doc.path });
                    requestDir(subDir);
                } else {
                    state.addFile(dir.id, {
                        name: doc.name,
                        url: doc.download_url,
                        type: doc.type,
                        path: doc.path,
                        status: "found",
                        repo: dir.repo
                    });
                }
            });

            state.unprocessedForDir(dir.id).forEach((file) => requestFile(file));
        } else {
            console.log(requestData.url);
            console.log(response.statusCode);
        };
    });
};

module.exports = requestDir;
