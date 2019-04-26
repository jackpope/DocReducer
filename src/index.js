//
// Export functions to help with vuepress layout configuration
//
const glob = require('glob');
const loadConfig = require('./load_config');

const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const getRepos = () => {
  return loadConfig()
    .all.sources.map(source => source.repos)
    .reduce((acc, curr) => [...acc, ...curr]);
};

const getChildren = (parentFilePath, dir) => {
  return glob
    .sync(`${parentFilePath}/${dir}/**/*.md`)
    .map(path => {
      // remove "parentFilePath" and ".md"
      let formattedPath = path.slice(parentFilePath.length + 1, -3);
      // remove README
      if (formattedPath.endsWith('README')) {
        formattedPath = formattedPath.slice(0, -6);
      }
      return formattedPath;
    })
    .sort();
};

module.exports = {
  navLinksGenerator: basePath => {
    return getRepos().map(repo => {
      return { text: capitalize(repo.name), link: `${basePath}/${repo.name}/` };
    });
  },
  sidebarLinksGenerator: (parentFilePath, basePath) => {
    const links = {};
    links[`/${basePath}`] = getRepos().map(repo => {
      return {
        title: capitalize(repo.name),
        collapsible: true,
        children: getChildren(parentFilePath, `${basePath}/${repo.name}`)
      };
    });

    return links;
  }
};
