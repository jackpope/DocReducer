"use strict";

const fs = require("fs"),
    configData = JSON.parse(
        fs.readFileSync(process.cwd() + "/doc-reducer.json", "utf8")
    );

const writeFile = function(file) {
    const baseDir = process.cwd() + configData.destination + `${file.repo}/`,
        filePath = baseDir + file.path.split("/").slice(1).join("/"),
        dir = filePath.split("/").slice(0, -1).join("/");

    if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`)
        fs.mkdirSync(dir);
    }

    fs.writeFile(filePath, file.contents, function (err) {
        if (err) {
            console.log(err);
            return false;
        }

        console.log(`Saved: ${filePath}`);
    });
};

module.exports = writeFile;
