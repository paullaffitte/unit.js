
const fs = require('fs');
const child_process = require('child_process');
const xml = require('xmlbuilder');
const pipeline = require('./pipeline');
const result = require('./result');
const exec = require('./exec').execAndTrace;

let _binary = null;
let _binaryRef = null;
let _index = -1;

let __results;

function prepareCmd(binary, args, stdin) {
  let cmd = binary + ' ' + (args || '');

  if (stdin) {
    cmd = `echo "${stdin}" | ` + cmd;
  }

  return cmd;
}

const actions = {
  cmd: function(options) {
    child_process.exec(options.literal, (err, stdout, stderr) => {
      if (typeof options.callback === 'function') {
        options.callback(err, stdout, stderr);
      }
      return next();
    });
  },

  test: function(options) {
    let student = {};
    let reference = {};

    let cmd = prepareCmd(_binary, options.args, options.stdin);
    let optionsRef = JSON.parse(JSON.stringify(options));
    let cmdRef = prepareCmd(_binaryRef, optionsRef.args, optionsRef.stdin);

    exec(cmd, options.timeout)
      .then((trace) => {
        student.trace = trace;
      })
      .then(exec.bind({}, cmdRef, options.timeout))
      .then((trace) => {
        reference.trace = trace;
      })
      .then(result.evaluate.bind({test: "aze bonjour"}, options, student, reference, __results))
      .then(next)
      .catch(console.error);
  },

  binary: function(path) {
    _binary = path;
    return next();
  },

  reference: function(path) {
    _binaryRef = path;
    return next();
  }
};

function next() {
  _index += 1;

  if (_index < pipeline.pipeline.length) {
    actions[pipeline.pipeline[_index].action](pipeline.pipeline[_index].options);
  } else {
    console.warn(__results.end({
      pretty: true
    }));
  }
}

module.exports = function() {
  __results = xml.create('testsuite');
  next();
};