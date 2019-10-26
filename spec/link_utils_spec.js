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

xdescribe('linkUtils.resolveLinks', () => {
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
        path: 'docs/doc.md'
      }
    ];

    it('updates unknown relative links to be exact', () => {
      const output = linkUtils.resolveLinks(
        unkownRelativeMarkdown,
        knownLocations,
        'https://www.github.com/user/repo/blob/master/docs/'
      );
      expect(output).toContain(
        'Some content with an unknown [link](https://www.github.com/user/repo/blob/master/images/thing.png)'
      );
    });

    it('updates known relative links to the correct path', () => {
      const output = linkUtils.resolveLinks(
        knownRelativeMarkdown,
        knownLocations,
        'https://www.github.com/user/repo/blob/master/'
      );
      expect(output).toContain('Some content with a known [link](./doc.md)');
    });

    it('does not update known relative links that are already correct', () => {
      const output = linkUtils.resolveLinks(
        knownRelativeMarkdownInCurrentDir,
        knownLocations,
        'https://www.github.com/user/repo/blob/master/docs/'
      );
      expect(output).toContain('a known [link](./doc.md)');
    });

    it('updates known exact links to be relative', () => {
      const output = linkUtils.resolveLinks(
        absoluteMarkdown,
        knownLocations,
        'https://www.github.com/user/repo/blob/master/docs/'
      );
      expect(output).toContain('a [known doc](./doc.md)');
    });

    it('does not update local header references', () => {
      const output = linkUtils.resolveLinks(
        localMarkdown,
        knownLocations,
        'https://www.github.com/user/repo/blob/master/docs/'
      );
      expect(output).toEqual(localMarkdown);
    });
  });
});
