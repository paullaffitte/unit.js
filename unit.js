const pipeline = require('./src/pipeline');
const result = require('./src/result');
const run = require('./src/run');
const addTester = run.addTester;

const binary = pipeline.binary;
const reference = pipeline.reference;
const test = pipeline.test;
const cmd = pipeline.cmd;
const success = result.success;
const failure = result.failure;

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