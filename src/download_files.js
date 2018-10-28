const fs = require('fs');
const mkdirp = require('mkdirp');
const request = require('request');
const headers = require('./request_headers.js');
const logger = require('./logger.js');

const configData = JSON.parse(
  fs.readFileSync(`${process.cwd()}/doc-reducer.json`, 'utf8'),
);

const downloadFiles = (fileList) => {
  const downloadFile = file => new Promise((resolve, reject) => {
    const baseDir = `${process.cwd() + configData.destination + file.repo}/`;
    const filePath = baseDir + file.path.split('/').slice(1).join('/');
    const dir = filePath.split('/').slice(0, -1).join('/');

    if (!fs.existsSync(dir)) {
      logger.log(`Creating directory: ${dir}`);
      mkdirp.sync(dir);
    }

    request({ url: file.url, headers })
      .on('error', e => reject(e))
      .pipe(fs.createWriteStream(filePath))
      .on('error', e => reject(e))
      .on('close', () => {
        logger.log("Wrote: ", filePath);
        logger.progress.updateCurrent(1);
        resolve(file);
      });
  });

  const allFiles = [].concat(...fileList).filter(file => file.type !== 'dir');
  return Promise.all(allFiles.map(downloadFile));
};

module.exports = downloadFiles;
