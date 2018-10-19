"use strict";

const fs = require("fs");

const directoryState = Object.freeze({
    org: "",
    repo: "",
    dir: "",
    directories: [],
    files: []
});
let state;

const guid = function() {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

// const recursiveDirFind = (obj, id) => {
//     if (obj.id === id) return true;
//     if (obj.directories.map( dir => recursiveDirFind(dir, id));
//     // if id matches, return true
// }

// {
//     directories: [
//         {
//             id:
//             directories: [
//                 {id: }
//             ]
//         }
//     ]
// }

const findDir = (currentDir, id) => {
    if (id === currentDir.id) {
        return currentDir;
    } else {
        // Use a for loop instead of forEach to avoid nested functions
        // Otherwise "return" will not work properly
        console.log(currentDir.directories);
        for (var i = 0; i < currentDir.directories.length; i += 1) {
            const currentChildDir = currentDir.directories[i];
            console.log(currentChildDir)
            // Search in the current child
            const result = findDir(currentChildDir, id);
            // Return the result if the node has been found
            if (result !== false) {
                return result;
            }
        }
        // The node has not been found and we have no more options
        return false;
    }
}

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
                // console.log(dirState);
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
        return findDir(state, dirId);
    },
    addSubDir: function(parentDirId, subDir) {
        subDir.id = guid();
        this.getDir(parentDirId).directories.push(subDir);
        return subDir;
    },
    addFile: function(dirId, file) {
        this.getDir(dirId).files.push(file);
        return file;
    }
}
