#! /usr/bin/env node
const unit = require('../unit');

unit.binary('./student');

unit.test({
  name: 'Package.Class.Test',
  stdout: '8\n'
});

unit.custom((callback) => {
  callback({
		// NECESSARY FIELDS
		name: 'ok.ok.ok',
		result: 'stdout', // Test result -> Possible values : success / stdout / stderr / crash / timeout / returnValue
		command: 'ls', // Executed command

		// COMPARISON FIELDS
		returnValue: 42, // Exit status
		stdout: 'Hello world!', // Test std output
		stderr: 'Error', // Test std error
		expected: {
			returnValue: 42, // Exit status
			stdout: 'Hello world!', // Test std output
			stderr: 'Error', // Test std error
    }, // Expected results -> Same fields as above

		// OPTIONAL FIELDS
		crash: 'SIGSEGV', // Exit signal (to be specified if test result is 'crash')
	});
});

unit.run();