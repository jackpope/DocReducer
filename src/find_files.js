const fs = require('fs');
const request = require('request');

const configData = JSON.parse(
  fs.readFileSync(`${process.cwd()}/doc-reducer.json`, 'utf8'),
);

const directoryState = Object.freeze({
  org: '',
  repo: '',
  dir: '',
  directories: [],
  files: [],
});

const directories = [];

configData.sources.forEach((src) => {
  const orgName = src.org;
  src.repos.forEach((repo) => {
    const repoName = repo.name;
    repo.directories.forEach((dir) => {
      const dirState = Object.assign({}, directoryState, {
        org: orgName,
        repo: repoName,
        dir,
      });
      // console.log(dirState);
      directories.push(dirState);
    });
  });
});

const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3.raw',
  'User-Agent': 'jackpope',
};

const writeFile = (file, resolve, reject) => {
  const baseDir = `${process.cwd() + configData.destination}${file.repo}/`;
  const filePath = baseDir + file.path.split('/').slice(1).join('/');
  const dir = filePath.split('/').slice(0, -1).join('/');

  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir);
  }

  fs.writeFile(filePath, file.contents, (err) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      console.log(filePath);
      resolve();
    }
  });
};

const buildAndWriteFiles = file => new Promise((resolve, reject) => {
  request({ url: file.url, headers }, (error, response, body) => {
    file.contents = body;
    writeFile(file, resolve, reject);
  });
});

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

    return getItemList(dir).then(fileListx => Promise.resolve(processItemList(fileListx))).catch(e => console.log(e));
  };

  return requestDir(startingDir);
};

const pullFiles = () => {
  const promises = directories.map(dir => requestDirRecursive(dir));
  return Promise.all(promises);
};

module.exports = pullFiles;
