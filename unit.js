const pipeline = require('./src/pipeline');
const result = require('./src/result');
const run = require('./src/run');

const binary = pipeline.binary;
const reference = pipeline.reference;
const test = pipeline.test;
const cmd = pipeline.cmd;
const success = result.success;
const failure = result.failure;

let _testers = {};

function addTester(testerName, tester) {
	_testers[testerName] = tester;
}

module.exports = {
  binary,
  reference,
  test,
  cmd,
  success,
  failure,
  run,
  addTester
};