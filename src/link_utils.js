const isAbsolute = url =>
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
    url
  );

const getAbsolute = (baseUrl, path) => {
  if (isAbsolute(path)) return path;
  // If relative path starts with /, default to current directory (./)
  const relativePath = path[0] === '/' ? `.${path}` : path;
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

const getRelative = (fromLink, toLink) => {
  let fromLinkRelative = '';
  const removeFirstTwoChars = toLink.relativePath.slice(0, 2) === './';
  let toLinkRelative = removeFirstTwoChars
    ? toLink.relativePath.slice(2, toLink.relativePath.length)
    : toLink.relativePath;

  const fromDirCount = fromLink.relativePath.split('/').length - 2;

  for (let index = 0; index < fromDirCount; index++) {
    fromLinkRelative += '../';
  }

  if (fromLink.repo !== toLink.repo) {
    toLinkRelative = `../${toLink.repo}/${toLinkRelative}`;
  }

  const result = (fromLinkRelative || './') + toLinkRelative;

  return result;
};

const resolveLinks = (markdownContent, knownFiles, currentFile) => {
  const markdownLinkMatcher = /\[([^[\]]+)\]\(([^)]+)/gm;
  let markdownContentCopy = markdownContent;
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = markdownLinkMatcher.exec(markdownContent)) !== null) {
    const linkIsLocalHeader = match[2][0] === '#';
    if (linkIsLocalHeader) return markdownContentCopy;

    const absLocation = currentFile.actualUrl.replace(currentFile.name, '');
    const absoluteUrl = getAbsolute(absLocation, match[2]);
    const knownFile = knownFiles.find(fileData => fileData.actualUrl === absoluteUrl);

    if (knownFile) {
      markdownContentCopy = markdownContentCopy.replace(
        match[2],
        getRelative(currentFile, knownFile)
      );
    } else {
      markdownContentCopy = markdownContentCopy.replace(match[2], absoluteUrl);
    }
  }

  return markdownContentCopy;
};

module.exports = {
  getAbsolute,
  getRelative,
  resolveLinks
};
