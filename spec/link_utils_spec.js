const linkUtils = require('../src/link_utils.js');

describe('linkUtils.getAbsolute', () => {
  const base = 'https://www.github.com/user/repo/blob/master/doc';

  it('returns an absolute url given a base url and a relative path', () => {
    const path = './my_doc.md';

    expect(linkUtils.getAbsolute(base, path)).toEqual(
      'https://www.github.com/user/repo/blob/master/doc/my_doc.md'
    );
  });

  it('will go up directories', () => {
    const path = '../images/thing.png';

    expect(linkUtils.getAbsolute(base, path)).toEqual(
      'https://www.github.com/user/repo/blob/master/images/thing.png'
    );
  });
});

xdescribe('linkUtils.getRelative', () => {
  const base = 'https://www.github.com/user/repo/blob/master/doc';

  it('returns a relative path given an exact url and a base', () => {
    const url = `${base}/foo/bar.md`;

    expect(linkUtils.getRelative(base, url)).toEqual(
      'https://www.github.com/user/repo/blob/master/doc/my_doc.md'
    );
  });
});

describe('linkUtils.resolveLinks', () => {
  describe('given markdown content', () => {
    const relativeMarkdown = `
      # headline
      Some content with an unknown [link](../images/thing.png) that is relative
    `;

    const absoluteMarkdown = `
      # headline
      An exact link to a [known doc](https://www.github.com/user/repo/blob/master/doc/something.md).
    `;

    const knownLocations = ['https://www.github.com/user/repo/blob/master/special_docs/'];

    const absoluteLocation = 'https://www.github.com/user/repo/blob/master/doc/';

    it('updates unknown relative links to be exact', () => {
      const output = linkUtils.resolveLinks(relativeMarkdown, knownLocations, absoluteLocation);
      expect(output).toContain(`
        Some content with a [link](https://www.github.com/user/repo/blob/master/images/thing.png)
      `);
    });

    it('updates known relative links to be correct', () => {});

    it('updates know exact links to be relative', () => {});
  });
});
