#! /usr/bin/env node
const unit = require('../unit');

unit.binary('./student');

unit.template({
	templatePath: '../main.c',
	compile: 'to_be_tested.c',
	params: '2'
});

unit.test({
  name: 'Package.Class.Test',
  stdout: '8\n'
});

unit.run();