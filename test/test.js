#! /usr/bin/env node
const unit = require('../unit');

unit.binary('./student');

unit.test({
  name: 'Package.Class.Test',
  stdout: '8\n'
});

unit.run();

unit.binary("...");

unit.addTester("outputCmp", (student, reference) => {
  if (student.stdout != reference.out)
    return {
      success: false,
      message: "output differs: " + student.stdout + " != " + reference.out
    }
});

unit.test({
  name: "...",
  args: "...",
  stdin: "...",
  timeout: "...",
  tester: {
    method: outputCmp
    reference: {
    	out: "test"
    }
  }
})