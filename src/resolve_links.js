const fs = require('fs');
const utils = require('./utils.js');

const resolveLinks = (fileList) => {
  const resolveLinksForFile = (file) => {
    return new Promise((resolve, reject) => {
      if (utils.isGenerated(file) || !utils.fileIsMarkdown(file)) {
        return resolve(file);
      }
      console.log(utils.fileLocation(file));
      resolve(file);
      // fs.readFile(utils.fileLocation(file), 'utf8', (err, data) => {

      // });
    });
  };

  return Promise.all(fileList.map(resolveLinksForFile));
};

module.exports = resolveLinks;
