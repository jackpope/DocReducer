const fs = require('fs');
const logger = require('./logger.js');

const directoryState = Object.freeze({
  org: '',
  repo: '',
  dir: '',
  directories: [],
});

const loadConfig = () => {
  const config = { all: {}, directories: [] };

  config.all = fs.readFileSync(`${process.cwd()}/doc-reducer.json`, 'utf8');

  JSON.parse(config.all).sources.forEach((src) => {
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
    });
  });
  logger.log(config);
  return config;
};

// const loadConfig = () => new Promise((resolve, reject) => {
//   const directories = [];

//   fs.readFile(`${process.cwd()}/doc-reducer.json`, 'utf8', (err, data) => {
//     if (err) return reject(err);

//     JSON.parse(data).sources.forEach((src) => {
//       const orgName = src.org;
//       src.repos.forEach((repo) => {
//         const repoName = repo.name;
//         repo.directories.forEach((dir) => {
//           const dirState = Object.assign({}, directoryState, {
//             org: orgName,
//             repo: repoName,
//             dir,
//           });
//           directories.push(dirState);
//         });
//       });
//     });
//     logger.log(directories);
//     resolve(directories);
//   });
// });

module.exports = loadConfig;
