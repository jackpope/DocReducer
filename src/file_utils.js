const { html } = require('common-tags');

const loadConfig = require('./load_config.js');

const isMarkdown = file => {
  return !!~file.name.toLowerCase().indexOf('.md');
};

const isReadme = file => {
  return file.name.toLowerCase() === 'readme.md';
};

const findLocalFilePath = file => {
  const baseDir = `${process.cwd() + loadConfig().all.destination + file.repo}/`;
  const filePath =
    baseDir +
    file.path
      .split('/')
      .slice(1)
      .join('/');

  return filePath;
};

const needsAttribution = file => {
  return file.type !== 'dir' && !!~file.name.toLowerCase().indexOf('md') && !isReadme(file);
};

const attributionTemplate = file => {
  return html`
    \n #### NOTE \n This file was pulled from its original location by doc-reducer.js. \n Edit the
    doc there and then use \`doc-reducer\` cmd to update it here. \n Original location:
    [${file.org}/${file.repo}/${file.path}](${file.actualUrl})\n
  `;
};

const dirFiles = (dir, allFiles, rootOnly = false) => {
  return allFiles.filter(file => {
    const filePath = file.path
      .split('/')
      .slice(0, -1)
      .join('/');
    const fileIsAtRepoRoot = filePath === '';

    // If file is at repo root (main readme), just match org/repo
    let matchesPath;
    if (fileIsAtRepoRoot) {
      matchesPath = true;
    } else {
      matchesPath = rootOnly ? filePath === dir.path : filePath.startsWith(dir.path);
    }

    return dir.org === file.org && dir.repo === file.repo && matchesPath;
  });
};

const dirContainsMdFile = (dir, allFiles) => {
  return !!dirFiles(dir, allFiles, true).find(file => isMarkdown(file));
};

const dirContainsReadmeFile = (dir, allFiles) => {
  return !!dirFiles(dir, allFiles, true).find(isReadme);
};

const dirNeedsReadme = (dir, allFiles) => {
  return dirContainsMdFile(dir, allFiles) && !dirContainsReadmeFile(dir, allFiles);
};

module.exports = {
  findLocalFilePath,
  needsAttribution,
  attributionTemplate,
  dirNeedsReadme,
  dirFiles,
  isMarkdown
};
