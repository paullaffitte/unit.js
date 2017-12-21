#! /usr/bin/env node

const unit = require('../unit.js');

unit.pipeline.binary('student');

unit.pipeline.cmd('gcc main.c -o student');
unit.pipeline.test({
  name: 'Name:Package.Class',
  args: 'arg1 arg2',
  stdout: '42\n'
});

unit.pipeline.test({
  name: 'Name:Package.Class',
  args: 'arg1 arg2',
  stdout: '42'
});

unit.pipeline.test({
  name: 'Name:Package.Class',
  args: 'arg1 arg2',
  stdout: '43\n'
});

unit.pipeline.cmd('rm -f student');

unit.run();