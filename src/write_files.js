const fs = require('fs');
const mkdirp = require('mkdirp');

const configData = JSON.parse(
  fs.readFileSync(`${process.cwd()}/doc-reducer.json`, 'utf8'),
);

const writeFiles = (fileList) => {
  const writeFile = file => new Promise((resolve, reject) => {
    const baseDir = `${process.cwd() + configData.destination + file.repo}/`;

    const filePath = baseDir + file.path.split('/').slice(1).join('/');
    const dir = filePath.split('/').slice(0, -1).join('/');

    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      mkdirp.sync(dir);
    }

    fs.writeFile(filePath, file.contents, (err) => {
      if (err) {
        return reject(err);
      }
      console.log('Wrote: ', filePath);
      resolve(file);
    });
  });
  const allFiles = [].concat(...fileList);
  return Promise.all(allFiles.map(file => writeFile(file)));
};

module.exports = writeFiles;
