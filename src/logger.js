const ProgressBar = require('progress');

const verboseMode = process.env.DEBUG_DOC_REDUCER === 'true';
let bar;

const progress = {
  init: (total, action) => {
    if (bar) {
      bar.terminate();
      bar = null;
    }

    const formattedAction = `  ${action}: |:bar| :current of :total`;
    bar = new ProgressBar(formattedAction, {
      total,
      complete: '=',
      incomplete: ' ',
      width: 30,
      renderThrottle: 0,
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
