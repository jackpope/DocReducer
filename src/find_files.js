const request = require('request');
const headers = require('./request_headers.js');
const logger = require('./logger.js');

const requestDirRecursive = (startingDir) => {
  const fileList = [];
  const dirQueue = [];

  const requestDir = (dir) => {
    // Store dir data in the fileList to pass it along to following steps
    fileList.push(Object.assign(dir, { type: 'dir', path: dir.dir }));

    const getItemList = (readDir) => {
      const requestData = {
        url: `https://api.github.com/repos/${readDir.org}/${readDir.repo}/contents/${readDir.dir}`,
        headers,
      };
      return new Promise((resolve, reject) => {
        request(requestData, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const itemList = JSON.parse(body).map((item) => {
              if (item.type !== 'dir') {
                logger.progress.addToTotal(1);
              }

              return {
                name: item.name,
                type: item.type,
                path: item.path,
                relativePath: item.path.replace(`${startingDir.dir}/`, ''),
                downloadUrl: item.download_url,
                actualUrl: item._links.html,
                org: readDir.org,
                repo: readDir.repo,
              };
            });

            resolve(itemList);
          } else {
            reject(Object.assign({}, JSON.parse(body), { for: readDir }));
          }
        });
      });
    };

    const processItemList = (itemList) => {
      itemList.forEach((item) => {
        if (item.type === 'dir') {
          dirQueue.push(item);
          return;
        }

        logger.log('Found: ', item.actualUrl);
        fileList.push(item);
      });

      if (dirQueue.length) {
        let nextDir = dirQueue.shift();
        nextDir = Object.assign({}, nextDir, { dir: nextDir.path });
        return requestDir(nextDir);
      }

      return Promise.resolve(fileList);
    };

    return getItemList(dir).then(processItemList);
  };

  return requestDir(startingDir);
};

const findFiles = (directories) => {
  logger.progress.init(0, 'Downloading documents');
  const promises = directories.map(dir => requestDirRecursive(dir));
  return Promise.all(promises);
};

module.exports = findFiles;
