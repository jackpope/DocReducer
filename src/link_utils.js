const isAbsolute = url => /^(?:[a-z]+:)?/.test(url);

const getAbsolute = (base, relative) => {
  if (isAbsolute(base)) return base;

  const stack = base.split('/');
  const parts = relative.split('/');

  // stack.pop(); // remove current file name (or empty string)
  // (omit if 'base' is the current folder without trailing slash)

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '.') { continue; }
    if (parts[i] === '..') { stack.pop(); } else { stack.push(parts[i]); }
  }
  return stack.join('/');
};

const resolveLinks = (markdownContent, knownFiles, absoluteLocation) => {
  const markdownLinkMatcher = /\[([^\[\]]+)\]\(([^)]+)/gm;
  const markdownContentCopy = markdownContent;
  let match;
  //
  // ./doc/thing.md => /thing.md (START HERE)
  // github.com../thing.md => /thing.md
  // ../images/pic.png => github.com../images/pic.png
  //
  // eslint-disable-next-line no-cond-assign
  while ((match = markdownLinkMatcher.exec(markdownContent)) !== null) {
    const absoluteUrl = getAbsolute(absoluteLocation, match[2]);
    const file = knownFiles.find(fileData => fileData.url === absoluteUrl)[0] || {};
    const filePath = file.path;
    markdownContentCopy.replace(match[2], filePath);
  }
};

module.exports = {
  getAbsolute,
  resolveLinks,
};
