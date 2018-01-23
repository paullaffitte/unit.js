const fs = require('fs');
const exec = require('child_process').exec;
const xml = require('xmlbuilder');
const pipeline = require('./pipeline');
const result = require('./result');

let binary = 'a.out';
let reference = null;
let index = -1;

let __results = 42;

function test(options) {
  let cmd = binary + ' ' + (options.args || '');

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
      crash: err ? (err.code === 139 ? 'SIGSEGV' : err.signal) : null
    };

    if (err && (err.signal || err.code === 139)) {
      result.failure(err.killed ? 'timeout' : 'crash', options, student, null, __results);
      return next();
    }

    if (reference) {
      let refCmd = reference + ' ' + (options.args || '');

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

/*
const r = {
	// NECESSARY FIELDS
	name: 'Package.Class.Name', // Test name
	result: 'stdout', // Test result -> Possible values : success / stdout / stderr / crash / timeout / returnValue
	command: 'ls', // Executed command

	// COMPARISON FIELDS
	returnValue: 42, // Exit status
	stdout: 'Hello world!', // Test std output
	stderr: 'Error', // Test std error
	expected: {}, // Expected results -> Same fields as above

	// OPTIONAL FIELDS
	crash: 'SIGSEGV', // Exit signal (to be specified if test result is 'crash')
};
*/

function customCallback(testResult) {
	if (testResult.result === 'success') {
		result.success(testResult, {}, {}, __results);
	} else {
		testResult.expected.finalCommand = testResult.command;
		testResult.expected.name = testResult.name;
		result.failure(testResult.result, testResult.expected, testResult, testResult.expected, __results);
	}

	return next();
}

function customTest(options) {
	options.callback(customCallback);
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
  },
	template: function(options) {
		let t = fs.readFileSync(options.templatePath).toString();

		Object.keys(options).forEach(key => {
			if (key !== 'templatePath' && key !== 'compile') {
				t = t.replace(`{{${key}}}`, options[key]);
			}
		});

		fs.writeFileSync('__instance.c', t);

		exec(`gcc -W -Wall -Wextra -Werror -o student __instance.c ${options.compile}`, function(err, stdout, stderr) {
			if (err) console.log(err);
			return next();
		});
	},
  custom: customTest
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