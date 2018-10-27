const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3.raw',
  'User-Agent': 'jackpope',
};

module.exports = headers;
