
const fs = require('fs');
const exec = require('child_process').exec;
const xml = require('xmlbuilder');
const pipeline = require('./pipeline');
const result = require('./result');

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

function prepareTrace(cmd, err, stdout, stderr) {

  let trace = {
    cmd: cmd,
    stdout: stdout,
    stderr: stderr,
    returnValue: err ? err.code : 0,
  };

  if (err) {
    trace.error = {
      signal: err.code === 139 ? 'SIGSEGV' : err.signal,
      label: err.killed ? 'timeout' : 'crash'
    };
  }
  return trace;
}

function execAndTrace(binary, options) {
  return new Promise(function(resolve, reject) {
    let cmd = prepareCmd(binary, options.args, options.stdin);
      exec(cmd, {
        timeout: options.timeout,
        killSignal: 'SIGTERM'
      }, (err, stdout, stderr) => {
        resolve(prepareTrace(cmd, err, stdout, stderr));
      });
  });
}

const actions = {
  cmd: function(options) {
    exec(options.literal, (err, stdout, stderr) => {
      if (typeof options.callback === 'function') {
        options.callback(err, stdout, stderr);
      }
      return next();
    });
  },

  test: function(options) {
    let student = null;
    let reference = null;

    options.timeout = options.timeout ? options.timeout : 3000;
    let optionsRef = JSON.parse(JSON.stringify(options));

    execAndTrace(_binary, options)
      .then((trace) => {
        student = trace;
      })
      .then(execAndTrace.bind({}, _binaryRef, optionsRef))
      .then((trace) => {
        reference = trace;
      })
      .then(() => {
        result.evaluate(options, student, reference, __results);
        next();
      })
      .catch((error) => {
        console.error(error);
      })
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