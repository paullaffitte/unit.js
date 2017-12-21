const exec = require('child_process').exec;
const pipeline = require('./pipeline');

let binary = 'a.out';
let index = -1;

function test(options) {
  const cmd = './' + binary + ' ' + options.args;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      if (err.signal) {
        pipeline.crash(options, stdout, err);
      } else {
        pipeline.failure(options, stdout, err);
      }
    } else {
      if ((options.stdout && stdout !== options.stdout)
        || (options.stderr && stderr !== options.stderr)) {
        pipeline.failure(options, stdout, stderr);
      } else {
        pipeline.success(options, stdout, stderr);
      }
    }

    next();
  });
}

const actions = {
  cmd: function(options) {
    exec(options.litteral, function(err, stdout, stderr) {
      if (typeof options.callback === 'function') {
        options.callback(err, stdout, stderr);
      }
      next();
    });
  },
  test: test,
  binary: function(path) {
    binary = path;
    next();
  }
};

function next() {
  index += 1;

  if (index < pipeline.pipeline.length) {
    actions[pipeline.pipeline[index].action](pipeline.pipeline[index].options);
  }
}

module.exports = next;