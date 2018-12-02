const { html } = require('common-tags');

const loadConfig = require('./load_config.js');

const findLocalFilePath = (file) => {
  const baseDir = `${process.cwd() + loadConfig().all.destination + file.repo}/`;
  const filePath = `${baseDir + file.path.split('/').slice(1).join('/')}`;

  return filePath;
};

const needsAttribution = (file) => {
  return file.type !== 'dir' && !!~file.name.toLowerCase().indexOf('md');
};

const attributionTemplate = (file) => {
  return '\n' + html`
      #### NOTE \n
      This file was pulled from its original location by doc-reducer.js. \n
      Edit the doc there and then use '$ doc-reducer' cmd to update it here. \n
      Original location: [${file.org}/${file.repo}/${file.path}](${file.actualUrl})\n
    `;
};

const dirFiles = (dir, allFiles, rootOnly = false) => {
  return allFiles.filter((file) => {
    const filePath = file.path.split('/').slice(0, -1).join('/');
    const matchesPath = rootOnly ? filePath === dir.path : filePath.startsWith(dir.path);
    return dir.org === file.org && dir.repo === file.repo && matchesPath;
  });
};

const isMarkdown = (file) => {
  return !!~file.name.toLowerCase().indexOf('.md');
};

const dirContainsMdFile = (dir, allFiles) => {
  return !!dirFiles(dir, allFiles, true).find(file => isMarkdown(file));
};

const dirContainsReadmeFile = (dir, allFiles) => {
  return !!dirFiles(dir, allFiles, true)
    .find(file => file.name.toLowerCase() === 'readme.md');
};

const dirNeedsReadme = (dir, allFiles) => {
  return dirContainsMdFile(dir, allFiles)
    && !dirContainsReadmeFile(dir, allFiles);
};

module.exports = {
  findLocalFilePath,
  needsAttribution,
  attributionTemplate,
  dirNeedsReadme,
  dirFiles,
  isMarkdown,
};
