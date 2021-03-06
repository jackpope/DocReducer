const fs = require('fs');
const logger = require('./logger.js');
const fileUtils = require('./file_utils.js');
const linkUtils = require('./link_utils.js');

const resolveLinks = fileList => {
  logger.progress.init(
    fileList.filter(f => fileUtils.needsLinkResolution(f)).length,
    'Resolving links'
  );

  const resolveLinksForFile = file => {
    return new Promise((resolve, reject) => {
      if (!fileUtils.needsLinkResolution(file)) {
        return resolve(file);
      }

      fs.readFile(fileUtils.findLocalFilePath(file), 'utf8', (readError, data) => {
        if (readError) {
          return reject(readError);
        }

        const resolvedData = linkUtils.resolveLinks(data, fileList, file);

        fs.writeFile(fileUtils.findLocalFilePath(file), resolvedData, writeError => {
          if (writeError) {
            return reject(writeError);
          }

          logger.progress.updateCurrent(1);
          return resolve(file);
        });
      });
    });
  };

  return Promise.all(fileList.map(resolveLinksForFile));
};

module.exports = resolveLinks;
