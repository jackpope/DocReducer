const utils = require('../src/utils.js');

describe('updateLinks', () => {
  describe('given markdown content', () => {
    const relativeMarkdown = `
      # headline
      Some content with an unknown [link](../images/thing.png) that is relative
      Another [relative link](dir/some_md.md) that we have a match for.
    `;

    const absoluteMarkdown = `
      # headline
      An exact link to a [known doc](https://www.github.com/user/repo/blob/master/doc/something.md).
    `;

    const knownLocations = [];

    const absoluteLocation = "https://www.github.com/user/repo/blob/master/doc/";

    it('updates unknown relative links to be exact', () => {
      const output = utils.resolveLinks(relativeMarkdown, knownLocations, absoluteLocation);
      expect(output).toContain(`
        Some content with a [link](https://www.github.com/user/repo/blob/master/images/thing.png)
      `);
    });

    it('updates known relative links to be correct', () => {

    });

    it('updates know exact links to be relative', () => {

    });
  });
});
