const fs = require('fs');
const logger = require('./logger.js');

const directoryState = Object.freeze({
  org: '',
  repo: '',
  dir: '',
  isReadme: false,
});

const loadConfig = () => {
  const config = { all: {}, directories: [] };

  config.all = JSON.parse(fs.readFileSync(`${process.cwd()}/doc-reducer.json`, 'utf8'));

  config.all.sources.forEach((src) => {
    const orgName = src.org;
    src.repos.forEach((repo) => {
      const repoName = repo.name;
      repo.directories.forEach((dir) => {
        const dirState = Object.assign({}, directoryState, {
          org: orgName,
          repo: repoName,
          dir,
        });
        config.directories.push(dirState);
      });

      if (repo.readmeName) {
        config.directories.push(Object.assign({}, directoryState, {
          org: orgName,
          repo: repoName,
          dir: repo.readmeName,
          isReadme: true,
        }));
      }
    });
  });

  logger.log(config);
  return config;
};

module.exports = loadConfig;
