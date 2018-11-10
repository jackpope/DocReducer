const fs = require('fs');
const utils = require('./utils.js');

const updateLinks = (fileList) => {
  const updateLinksForFile = (file) => {
    return new Promise((resolve, reject) => {
      if (utils.isGenerated(file) || !utils.fileIsMarkdown(file)) {
        return resolve(file);
      }
      console.log(utils.fileLocation(file));
      resolve(file)
      // fs.readFile(utils.fileLocation(file), 'utf8', (err, data) => {

      // });
    });
  };

  return Promise.all(fileList.map(updateLinksForFile));
};

module.exports = updateLinks;
