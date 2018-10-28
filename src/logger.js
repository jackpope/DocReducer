const ProgressBar = require('progress');

const verboseMode = process.env.DEBUG_DOC_REDUCER === 'true';
let bar;

const progress = {
  init: (total, action) => {
    action = `  ${action}: |:bar| :current of :total`;
    bar = new ProgressBar(action, {
      total,
      complete: '=',
      incomplete: ' ',
      width: 40,
    });
  },
  updateCurrent: (count) => {
    bar.tick(count);
  },
  addToTotal: (total) => {
    bar.total += total;
  },
  end: () => {
    bar.terminate();
  },
};

const log = (...args) => {
  if (verboseMode) {
    console.log(...args);
  }
};

module.exports = {
  progress,
  log,
};
