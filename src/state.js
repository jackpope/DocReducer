"use strict";

const fs = require("fs");

const directoryState = Object.freeze({
    org: "",
    repo: "",
    dir: "",
    files: []
});
let state;

const guid = function() {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

// Read config file and store data as 'state'
const configDataToState = function() {
    let configData = JSON.parse(
        fs.readFileSync(process.cwd() + "/doc-reducer.json", "utf8")
    );
    let dirCollection = [];
    configData.sources.forEach(function(src) {
        let orgName = src.org;
        src.repos.forEach(function(repo) {
            let repoName = repo.name;
            repo.directories.forEach(function(dir) {
                let dirState = Object.assign({}, directoryState, {
                    org: orgName,
                    repo: repoName,
                    dir: dir,
                    id: guid()
                });
                console.log(dirState);
                dirCollection.push(dirState);
            });
        });
    });
    return dirCollection;
};

module.exports = {
    init: function() {
        if (!state) {
            state = {
                directories: configDataToState()
            };
        }

        return this;
    },
    getState: function() { return state },
    getDir: function(dirId) {
        return state.directories.find(dir => dir.id === dirId);
    },
    addFile: function(dirId, data) {
        this.getDir(dirId).files.push(data);
    },
    unprocessedForDir: function(dirId) {
        return this.getDir(dirId).files.filter((file) => file.status === "found");
    },
}
