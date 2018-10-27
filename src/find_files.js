const request = require('request');
const headers = require('./request_headers.js');

const requestDirRecursive = (startingDir) => {
  const fileList = [];
  const dirQueue = [];

  const requestDir = (dir) => {
    const getItemList = (readDir) => {
      const requestData = {
        url: `https://api.github.com/repos/${readDir.org}/${readDir.repo}/contents/${readDir.dir}`,
        headers,
      };
      return new Promise((resolve, reject) => {
        request(requestData, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const itemList = JSON.parse(body).map(item => ({
              name: item.name,
              type: item.type,
              path: item.path,
              url: item.download_url,
              org: readDir.org,
              repo: readDir.repo,
            }));
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

        console.log('Collected: ', item.url);
        fileList.push(item);
      });

      if (dirQueue.length) {
        let nextDir = dirQueue.shift();
        nextDir = Object.assign({}, nextDir, { dir: nextDir.path });
        return requestDir(nextDir);
      }

      return fileList;
    };

    return getItemList(dir)
      .then(completeFileList => Promise.resolve(processItemList(completeFileList)));
  };

  return requestDir(startingDir);
};

const findFiles = (directories) => {
  const promises = directories.map(dir => requestDirRecursive(dir));
  return Promise.all(promises);
};

module.exports = findFiles;
