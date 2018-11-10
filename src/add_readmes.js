const fs = require('fs');

const loadConfig = require('./load_config.js');
const logger = require('./logger.js');
const readmeFromTemplate = require('./readme_from_template.js');
const fileUtils = require('./file_utils.js');

const addReadmes = (fileList) => {
  const generatedFiles = [];
  const needsReadmeList = fileList.filter( file => utils.dirNeedsReadme(file, fileList));
  logger.progress.init(needsReadmeList.length, 'Generating README for each directory');

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

        // Add generated README to fileList
        generatedFiles.push(Promise.resolve({
          name: 'README.md',
          type: 'generated_readme',
          path: relativePath,
          org: dir.org,
          repo: dir.repo,
        }));
        logger.progress.updateCurrent(1);
        return resolve(dir);
      });
    });
  };

  return Promise.all(fileList.map(addReadmeForDir).concat(generatedFiles));
};

module.exports = addReadmes;
