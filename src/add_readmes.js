const fs = require('fs');

const loadConfig = require('./load_config.js');
const logger = require('./logger.js');
const readmeFromTemplate = require('./readme_from_template.js');
const fileUtils = require('./file_utils.js');

const addReadmes = (fileList) => {
  const dirList = fileList.filter(file => file.type === 'dir');
  const realFiles = fileList.filter(file => file.type !== 'dir');
  logger.progress.init(dirList.length, 'Generating README for each directory');

  const addReadmeForDir = (dir) => {
    return new Promise((resolve, reject) => {
      if (!fileUtils.dirNeedsReadme(dir, realFiles)) {
        logger.progress.updateCurrent(1);
        return resolve(dir);
      }

      const filesInDir = fileUtils.dirFiles(dir, realFiles).filter(file => fileUtils.isMarkdown(file));
      const readmeContent = readmeFromTemplate(dir.org, dir.repo, filesInDir);

      // TODO: this can be combined with download_files logic?
      const baseDir = `${process.cwd() + loadConfig().all.destination + dir.repo}/`;
      const filePath = `${baseDir + dir.path.split('/').slice(1).join('/')}/README.md`;

      fs.writeFile(filePath, readmeContent, (err) => {
        if (err) {
          return reject(err);
        }

        logger.progress.updateCurrent(1);
        return resolve(dir);
      });
    });
  };

  // Only run readmes on dirs
  // BUT keep files around with resolved promises to pass them to the next step
  return Promise.all(
    dirList
      .map(addReadmeForDir)
      .concat(realFiles.map(file => Promise.resolve(file))),
  );
};

module.exports = addReadmes;
