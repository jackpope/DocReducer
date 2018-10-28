const fs = require('fs');
const { html } = require('common-tags');
const logger = require('./logger.js');

const configData = JSON.parse(
  fs.readFileSync(`${process.cwd()}/doc-reducer.json`, 'utf8')
);

const needsAttribution = (file) => {
  return file.type !== 'dir' && !!~file.name.toLowerCase().indexOf('md');
};

const addAttributions = (fileList) => {

  logger.progress.init(
    fileList.filter(needsAttribution).length,
    'Adding attributions to each md file',
  );

  // TODO: move this to a utils lib?
  const findLocalFile = (file) => {
    const baseDir = `${process.cwd() + configData.destination + file.repo}/`;
    const filePath = `${baseDir + file.path.split('/').slice(1).join('/')}`;

    return filePath;
  };

  const attributionTemplate = (file) => {
    return '\n' + html`
      #### NOTE \n
      This file was pulled from its original location by doc-reducer.js. \n
      Edit the doc there and then use '$ doc-reducer' cmd to update it here. \n
      Original location: [${file.org}/${file.repo}/${file.path}](${file.actualUrl})\n
    `;
  };

  const addAttribution = (file) => {
    return new Promise((resolve, reject) => {
      if (!needsAttribution(file)) {
        return resolve(file);
      }

      const fileLocation = findLocalFile(file);

      if (!fs.existsSync(fileLocation)) {
        return reject(new Error(`File not found: ${fileLocation}`));
      }

      attributionTemplate(file);

      fs.appendFile(fileLocation, attributionTemplate(file), (err) => {
        if (err) return reject(err);
        logger.progress.updateCurrent(1);
        return resolve(file);
      });
    });
  };

  return Promise.all(fileList.map(addAttribution));
};

module.exports = addAttributions;
