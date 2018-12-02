// Generates markdown content:
// -------------------------------------
// # {{org}}/{{repo}} documentation
//
// Docs:
// {{fileLinks}}
//
// This file was generated by vuepress-doc-reducer.js
//
const { html } = require('common-tags');

const readmeFromTemplate = (org, repo, files) => {
  // Get each file name as a link in a list item in md syntax
  // Sort by relativePath and add indents for each level to group by dir
  const mappedFiles = {};
  files.forEach((file) => {
    // set keys as relativePaths without file names
    const groupName = file.relativePath.split('/').slice(0, -1).join() || '__base__';
    if (!mappedFiles[groupName]) { mappedFiles[groupName] = [] };
    mappedFiles[groupName].push(file);
  });

  let fileLinkStr = '';
  Object.keys(mappedFiles).forEach((key) => {
    const needsSubSection = key !== '__base__';
    const indentation = needsSubSection ? ' ' : '';
    if (needsSubSection) fileLinkStr += `\n #### ${key}\n`;
    fileLinkStr += mappedFiles[key]
      .map(({ name, relativePath }) => `${indentation}- [${name}](./${org}/${repo}/${relativePath})\n`)
      .join('');
  });

  return html`
    # ${org}/${repo} documentation \n\n
    ### Docs: \n
    ${fileLinkStr}\n\n
  `;
};

module.exports = readmeFromTemplate;
