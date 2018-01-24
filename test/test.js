#! /usr/bin/env node
const unit = require('../unit');

unit.addEvaluator("koala_static", function(student) {
  if (student.stdout != "koala") {
    return {
      success: false,
      message: "output differs: " + student.stdout + " != koala\n\n",
      summary: "output differs"
    };
  }

  return {
      success: true
    };
});

unit.addEvaluator("stdout_static", function(student) {
  if (student.stdout != this.stdout) {
    return {
      success: false,
      message: `output differs: ${student.stdout} != ${this.stdout}\n\n`,
      summary: "output differs"
    };
  }

  return {
      success: true
    };
});

unit.addEvaluator("stdout", function(student, reference) {
  console.log("----------------", student.stdout, " | ", reference.stdout, "-------");
  if (student.stdout != reference.stdout) {
    return {
      success: false,
      message: `output differs: ${student.stdout} != ${reference.stdout}\n\n`,
      summary: "output differs"
    };
  }

  return {
      success: true
    };
});

unit.binary("./test.sh");
unit.reference("./ref.sh");

unit.test({
  name: "basic.koala_static.koala",
  // stdin: "",
  timeout: 1000,
  evaluator: {
    method: "koala_static"
  }
});

unit.test({
  name: "basic.stdout_static.koala",
  timeout: 1000,
  evaluator: {
    method: "stdout_static",
    reference: {
      stdout: "koala"
    }
  }
});

unit.test({
  name: "basic.stdout_static.args",
  args: "-h",
  evaluator: {
    method: "stdout_static",
    reference: {
      stdout: "koala"
    }
  }
});

unit.test({
  name: "basic.stdout.args",
  args: "-h",
  evaluator: {
    method: "stdout"
  }
});

unit.test({
  name: "basic.stdout.args",
  args: "-h -f",
  evaluator: {
    method: "stdout"
  }
});

unit.run();