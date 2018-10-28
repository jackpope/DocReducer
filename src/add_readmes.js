const fs = require('fs');
const logger = require('./logger.js');
const readmeFromTemplate = require('./readme_from_template.js');

const configData = JSON.parse(
  fs.readFileSync(`${process.cwd()}/doc-reducer.json`, 'utf8'),
);

const dirFiles = (dir, allFiles) => {
  return allFiles.filter((file) => {
    const filePath = file.path.split('/').slice(0, -1).join('/');
    return dir.org === file.org && dir.repo === file.repo && dir.path === filePath;
  });
};

const dirContainsMdFile = (dir, allFiles) => {
  return !!dirFiles(dir, allFiles)
    .find(file => !!~file.name.toLowerCase().indexOf('.md'));
};

const dirContainsReadmeFile = (dir, allFiles) => !!dirFiles(dir, allFiles)
  .find(file => file.name.toLowerCase() === 'readme.md');

const dirNeedsReadme = (dir, allFiles) => dirContainsMdFile(dir, allFiles) &&
  !dirContainsReadmeFile(dir, allFiles);

const addReadmes = (fileList) => {
  const dirList = fileList.filter(file => file.type === 'dir');
  const realFiles = fileList.filter(file => file.type !== 'dir');
  logger.progress.init(dirList.length, 'Generating README for each directory');

  const addReadmeForDir = (dir) => {
    return new Promise((resolve, reject) => {
      if (!dirNeedsReadme(dir, realFiles)) {
        logger.progress.updateCurrent(1);
        return resolve(dir);
      }

      const filesInDir = dirFiles(dir, realFiles);
      const readmeContent = readmeFromTemplate(dir.org, dir.repo, filesInDir);

      // TODO: this can be combined with download_files logic?
      const baseDir = `${process.cwd() + configData.destination + dir.repo}/`;
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
