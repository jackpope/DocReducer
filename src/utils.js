const fs = require('fs');

const fileLocation = (file) => {
  const baseDir = `${process.cwd() + utils.readConfigData.destination + dir.repo}/`;
  const relativePath = `${dir.path.split('/').slice(1).join('/')}/README.md`;
  return baseDir + relativePath;
}

const readConfigData = JSON.parse(
  fs.readFileSync(`${process.cwd()}/doc-reducer.json`, 'utf8'),
);

const dirFiles = (dir, allFiles) => allFiles.filter((file) => {
  const filePath = file.path.split('/').slice(0, -1).join('/');
  return file.type !== 'dir'
    && dir.org === file.org
      && dir.repo === file.repo
        && dir.path === filePath;
});

const isGenerated = file => file.type === 'generated_readme';

const isMarkdown = file => !!~file.name.toLowerCase().indexOf('.md');

const isDir = file => file.type === 'dir';

const dirContainsMdFile = (dir, allFiles) => !!dirFiles(dir, allFiles).find(isMarkdown);

const dirContainsReadmeFile = (dir, allFiles) => !!dirFiles(dir, allFiles)
  .find(file => file.name.toLowerCase() === 'readme.md');

const dirNeedsReadme = (dir, allFiles) => isDir(dir)
  && dirContainsMdFile(dir, allFiles)
    && !dirContainsReadmeFile(dir, allFiles);

module.exports = {
  dirNeedsReadme,
  dirFiles,
  readConfigData,
  isGenerated,
  isMarkdown,
};
