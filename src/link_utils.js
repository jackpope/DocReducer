const isAbsolute = url => /^(?:[a-z]+:)?/.test(url);

const getAbsolute = (baseUrl, relativePath) => {
  const stack = baseUrl.split('/');
  const parts = relativePath.split('/');

  const trailingSlashOnBaseUrl = stack[stack.length - 1] === '';
  if (trailingSlashOnBaseUrl) stack.pop();

  for (let i = 0; i < parts.length; i++) {
    const nextPart = parts[i];

    switch (nextPart) {
      case '..':
        stack.pop();
        break;
      case '.':
        break;
      default:
        stack.push(nextPart);
        break;
    }
  }
  return stack.join('/');
};

const resolveLinks = (markdownContent, knownFiles, absoluteLocation) => {
  const markdownLinkMatcher = /\[([^\[\]]+)\]\(([^)]+)/gm;
  let markdownContentCopy = markdownContent;
  let match;
  //
  // ./doc/thing.md => /thing.md (START HERE)
  // github.com../thing.md => /thing.md
  // ../images/pic.png => github.com../images/pic.png
  //
  // eslint-disable-next-line no-cond-assign
  while ((match = markdownLinkMatcher.exec(markdownContent)) !== null) {
    console.log('MATCH', absoluteLocation, match[2]);
    const absoluteUrl = getAbsolute(absoluteLocation, match[2]);
    console.log(absoluteUrl);
    const knownFile = knownFiles.find(fileData => fileData.url === absoluteUrl);
    if (knownFile) {
      const filePath = knownFile.path;
      markdownContentCopy = markdownContentCopy.replace(match[2], filePath);
    } else {
      markdownContentCopy = markdownContentCopy.replace(match[2], absoluteUrl);
    }
  }

  return markdownContentCopy;
};

module.exports = {
  getAbsolute,
  resolveLinks
};
