"use strict";

// const state = require("./state.js").init(),
const readmeFromTemplate = require("./readme_from_template.js");

const dirHasReadme = function(dir) {
    const matcher = new RegExp(/readme\.md$/i);
    return dir.files.filter((file) => matcher.test(file.name)).length;
};

const generateReadmeForDir = function(dir) {
    console.log('readme?')

    if (dirHasReadme(dir)) return;

    console.log("Creating README", dir)

    const content = readmeFromTemplate(
        dir.org,
        dir.repo,
        dir.files.map((file) => file.name)
    );

    return {
        name: "README.md",
        url: null,
        type: "file",
        path: `${dir.dir}/README.md`,
        status: "generated",
        repo: dir.repo,
        source: "localReadme",
        contents: content
    }
};

module.exports = generateReadmeForDir;
