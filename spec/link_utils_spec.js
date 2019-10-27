const linkUtils = require('../src/link_utils.js');

describe('linkUtils.getAbsolute', () => {
  const base = 'https://www.github.com/user/repo/blob/master/doc';
  const baseWithTrailingSlash = 'https://www.github.com/user/repo/blob/master/doc/';

  it('returns an absolute url given a base url and a relative path', () => {
    const path = './my_doc.md';

    expect(linkUtils.getAbsolute(base, path)).toEqual(
      'https://www.github.com/user/repo/blob/master/doc/my_doc.md'
    );

    expect(linkUtils.getAbsolute(baseWithTrailingSlash, path)).toEqual(
      'https://www.github.com/user/repo/blob/master/doc/my_doc.md'
    );
  });

  it('will go up directories', () => {
    const path = '../images/thing.png';

    expect(linkUtils.getAbsolute(base, path)).toEqual(
      'https://www.github.com/user/repo/blob/master/images/thing.png'
    );

    expect(linkUtils.getAbsolute(baseWithTrailingSlash, path)).toEqual(
      'https://www.github.com/user/repo/blob/master/images/thing.png'
    );
  });
});

describe('linkUtils.getRelative', () => {
  const files = [
    {
      actualUrl: 'https://www.github.com/user/repo/blob/master/docs/doc.md',
      name: 'doc.md',
      path: 'docs/doc.md',
      relativePath: './doc.md',
      repo: 'repo'
    },
    {
      actualUrl: 'https://www.github.com/user/repo/blob/master/docs/subdir/doc.md',
      name: 'doc.md',
      path: 'docs/subdir/doc.md',
      relativePath: './subdir/doc.md',
      repo: 'repo'
    },
    {
      actualUrl: 'https://www.github.com/user/repo2/blob/master/docs/sub/doc.md',
      name: 'doc.md',
      path: 'docs/sub/doc.md',
      relativePath: './sub/docs.md',
      repo: 'repo2'
    }
  ];

  it('returns a relative path from one absolute location to another within the same repo', () => {
    expect(linkUtils.getRelative(files[1], files[0])).toEqual('../doc.md');
  });

  it('returns a relative path from one absolute location to another within another known repo', () => {
    expect(linkUtils.getRelative(files[2], files[0])).toEqual('../../repo/doc.md');
  });
});

describe('linkUtils.resolveLinks', () => {
  describe('given markdown content', () => {
    const unkownRelativeMarkdown = `
      # headline
      Some content with an unknown [link](../images/thing.png) that is relative
    `;

    const knownRelativeMarkdown = `
      # headline
      Some content with a known [link](docs/doc.md) that is relative.
    `;

    const knownRelativeMarkdownInCurrentDir = `
    # headline
      Some content with a known [link](./doc.md) that is relative.
    `;

    const absoluteMarkdown = `
      # headline
      An exact link to a [known doc](https://www.github.com/user/repo/blob/master/docs/doc.md).
    `;

    const localMarkdown = `a table of [contents](#part1)`;

    const knownLocations = [
      {
        actualUrl: 'https://www.github.com/user/repo/blob/master/docs/doc.md',
        name: 'doc.md',
        path: 'docs/doc.md',
        relativePath: './doc.md',
        repo: 'repo'
      },
      {
        actualUrl: 'https://www.github.com/user/repo/blob/master/docs/doc.md',
        name: 'docs/doc.md',
        path: 'docs/doc.md',
        relativePath: './doc.md',
        repo: 'repo'
      },
      {
        actualUrl: 'https://www.github.com/user/repo2/blob/master/docs/sub/doc.md',
        name: 'doc.md',
        path: 'docs/sub/doc.md',
        relativePath: './sub/docs.md',
        repo: 'repo2'
      }
    ];

    it('updates unknown relative links to be exact', () => {
      const output = linkUtils.resolveLinks(
        unkownRelativeMarkdown,
        knownLocations,
        knownLocations[0]
      );
      expect(output).toContain(
        'Some content with an unknown [link](https://www.github.com/user/repo/blob/master/images/thing.png)'
      );
    });

    it('updates known relative links to the correct path', () => {
      const output = linkUtils.resolveLinks(
        knownRelativeMarkdown,
        knownLocations,
        knownLocations[1]
      );
      expect(output).toContain('Some content with a known [link](./doc.md)');
    });

    it('does not update known relative links that are already correct', () => {
      const output = linkUtils.resolveLinks(
        knownRelativeMarkdownInCurrentDir,
        knownLocations,
        knownLocations[0]
      );
      expect(output).toContain('a known [link](./doc.md)');
    });

    it('updates known exact links to be relative within the same repo', () => {
      const output = linkUtils.resolveLinks(absoluteMarkdown, knownLocations, knownLocations[0]);
      expect(output).toContain('a [known doc](./doc.md)');
    });

    it('updates known exact links to be relative from another repo', () => {
      // Go back out to root, then back in on another project
      const output = linkUtils.resolveLinks(absoluteMarkdown, knownLocations, knownLocations[2]);
      expect(output).toContain('a [known doc](../../repo/doc.md)');
    });

    it('does not update local header references', () => {
      const output = linkUtils.resolveLinks(localMarkdown, knownLocations, knownLocations[0]);
      expect(output).toEqual(localMarkdown);
    });
  });
});
