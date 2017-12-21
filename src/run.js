const exec = require('child_process').exec;
const xml = require('xmlbuilder');
const pipeline = require('./pipeline');
const result = require('./result');

let binary = 'a.out';
let reference = null;
let index = -1;

let __results;

function test(options) {
  let cmd = './' + binary + ' ' + (options.args || '');

  if (options.stdin) {
    cmd = `echo "${options.stdin}" | ` + cmd;
  }

  options.finalCommand = cmd;

  exec(cmd, {
    timeout: 3000,
    killSignal: 'SIGTERM'
  }, (err, stdout, stderr) => {
    const student = {
      stdout: stdout,
      stderr: stderr,
      returnValue: err ? err.code : 0,
      crash: err ? err.signal : null
    };

    if (student.crash) {
      result.failure(student.crash === 'SIGTERM' ? 'timeout' : 'crash', options, student, __results);
      return next();
    }

    if (reference) {
      let refCmd = './' + reference + ' ' + options.args;

      if (options.stdin) {
        refCmd = `echo "${options.stdin}" | ` + refCmd;
      }

      exec(refCmd, (refErr, refStdout, refStderr) => {
        const ref = {
          stdout: refStdout,
          stderr: refStderr,
          returnValue: refErr ? refErr.code : 0,
          crash: refErr ? refErr.signal : null
        };

        if (student.stdout !== ref.stdout) {
          result.failure('stdout', options, student, ref, __results);
        } else if (student.stderr !== ref.stderr) {
          result.failure('stderr', options, student, ref, __results);
        } else if (student.returnValue !== ref.returnValue) {
          result.failure('returnValue', options, student, ref, __results);
        } else {
          result.success(options, student, ref, __results);
        }

        return next();
      });
    } else {
      if (typeof options.stdout !== 'undefined' && student.stdout !== options.stdout) {
        result.failure('stdout', options, student, options, __results);
      } else if (typeof options.stderr !== 'undefined' && student.stderr !== options.stderr) {
        result.failure('stderr', options, student, options, __results);
      } else if (typeof options.returnValue !== 'undefined' && student.returnValue !== options.returnValue) {
        result.failure('returnValue', options, student, options, __results);
      } else {
        result.success(options, student, options, __results);
      }

      return next();
    }
  });
}

const actions = {
  cmd: function(options) {
    exec(options.literal, function(err, stdout, stderr) {
      if (typeof options.callback === 'function') {
        options.callback(err, stdout, stderr);
      }
      return next();
    });
  },
  test: test,
  binary: function(path) {
    binary = path;
    return next();
  },
  reference: function(path) {
    reference = path;
    return next();
  }
};

function next() {
  index += 1;

  if (index < pipeline.pipeline.length) {
    actions[pipeline.pipeline[index].action](pipeline.pipeline[index].options);
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