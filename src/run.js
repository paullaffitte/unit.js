
const fs = require('fs');
const exec = require('child_process').exec;
const xml = require('xmlbuilder');
const pipeline = require('./pipeline');
const result = require('./result');

let _binary = null;
let _binaryRef = null;
let _index = -1;
let _testers = {};

let __results;


function addTester(testerName, tester) {
  _testers[testerName] = tester;
}

function prepareCmd(binary, args, stdin) {
  let cmd = _binary + ' ' + (options.args || '');

  if (options.stdin) {
    cmd = `echo "${options.stdin}" | ` + cmd;
  }

  return cmd;
}

function prepareTrace(err, stdout, stderr) {

  let trace = {
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
    options.cmd = prepareCmd(binary, options.args, options.stdin)
      exec(options.cmd, {
        timeout: timeout,
        killSignal: 'SIGTERM'
      }, prepareTrace});
  });
}

function evaluate(student, reference, tester) {
  if (student.error) {
    result.failure(options, student, null, __results);
    return next();
  }

  let result = tester.method(student, reference);
  if (result && !result.success) {
    result.failure(options, student, reference, __results);
  } else {
    result.success(options, student, reference, __results);
  }

  return next();
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
    let timeout = options.timeout ? options.timeout : 3000;
    let student = null;
    let reference = null;

    then(execAndTrace(_binary, options))
      .then((trace) => {
        student = trace;
      })
      .execAndTrace(_binaryRef, options)
      .then((trace) => {
        reference = trace;
      })
      .then(() => {
        evaluate(student, reference, options.tester);
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