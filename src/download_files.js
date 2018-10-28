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

    request({ url: file.downloadUrl, headers })
      .on('error', e => reject(e))
      .pipe(fs.createWriteStream(filePath))
      .on('error', e => reject(e))
      .on('close', () => {
        logger.log('Wrote: ', filePath);
        logger.progress.updateCurrent(1);
        resolve(file);
      });
  });

  // Only run download on non-dir files,
  // BUT keep dirs around with resolved promises to pass them to the next step
  const allFiles = [].concat(...fileList);
  const realFiles = allFiles
    .filter(file => file.type !== 'dir');
  const dirFiles = allFiles
    .filter(file => file.type === 'dir')
    .map(dir => Promise.resolve(dir));
  return Promise.all(realFiles.map(downloadFile).concat(dirFiles));
};

module.exports = downloadFiles;
