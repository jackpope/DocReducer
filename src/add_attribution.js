const fs = require('fs');

const fileUtils = require('./file_utils.js');
const logger = require('./logger.js');

const addAttributions = fileList => {
  logger.progress.init(
    fileList.filter(fileUtils.needsAttribution).length,
    'Adding attributions to each md file'
  );

  const addAttribution = file => {
    return new Promise((resolve, reject) => {
      if (!fileUtils.needsAttribution(file)) {
        return resolve(file);
      }

      const fileLocation = fileUtils.findLocalFilePath(file);

      if (!fs.existsSync(fileLocation)) {
        return reject(new Error(`File not found: ${fileLocation}`));
      }

      fs.appendFile(fileLocation, fileUtils.attributionTemplate(file), err => {
        if (err) return reject(err);
        logger.progress.updateCurrent(1);
        return resolve(file);
      });
    });
  };

  return Promise.all(fileList.map(addAttribution));
};

module.exports = addAttributions;
