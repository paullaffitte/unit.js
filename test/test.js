#! /usr/bin/env node
const unit = require('../unit');

unit.binary("./test.sh");

unit.addEvaluator("koala", (student) => {
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

unit.test({
  name: "Test.Class.koala",
  // args: "",
  // stdin: "",
  timeout: 1000,
  evaluator: {
    method: "koala"
    // reference: {
    //   out: "test"
    // }
  }
});

unit.test({
  name: "Test.Class.koala",
  args: "-h",
  // stdin: "",
  timeout: 1000,
  evaluator: {
    method: "koala"
    // reference: {
    //   out: "test"
    // }
  }
});

unit.run();