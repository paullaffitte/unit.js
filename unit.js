const pipeline = require('./src/pipeline');
const result = require('./src/result');
const run = require('./src/run');
const exec = require('./src/exec').execAndTrace;

const binary = pipeline.binary;
const reference = pipeline.reference;
const test = pipeline.test;
const cmd = pipeline.cmd;
const addEvaluator = result.addEvaluator;
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
  addEvaluator,
  exec
};