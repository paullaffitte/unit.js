const logger = require('./logger');

let _evaluators = {};

function addEvaluator(evaluatorName, evaluator) {
  _evaluators[evaluatorName] = evaluator;
}

function evaluate(test, student, reference, __results) {
  if (student.error) {
    // console.log(student, __results);
    failure(test, student, null, __results);
    return;
  }

  let evaluator = _evaluators[test.evaluator.method];
  if (test.evaluator.reference) {
    evaluator = evaluator.bind(test.evaluator.reference);
  } else {
    evaluator = evaluator.bind({});
  }

  let result = evaluator(student, reference);
  if (result && !result.success) {
    failure(test, student, result, __results);
  } else {
    success(test, result, __results);
  }
}

function getLogs(test, student, result) {
  let msg = result ? result.message : '';
  let exitSignal = 'None (process exited normally)';

  if (student.error) {
    exitSignal = `${student.error.signal} [${student.error.label}]`;
  }

  msg += `Executed shell command: ${student.cmd}\n`;
  msg += `Process exit signal: ${exitSignal}\n`;
  msg += `Process exit status: ${student.returnValue}`;
  return msg;
}

function success(test, result, __results) {
  logger.testcase(__results, test);
  console.log(test.name + ' > SUCCESS');
}

function failure(test, student, result, __results) {
  let testcase = logger.testcase(__results, test);

  let logs = getLogs(test, student, result);
  if (student.error) {
    console.log(test.name + ' > ERROR (' + student.error.label + ')');
    logger.error(testcase, logs);
  } else {
    let failureSummary = (result ? result.summary : '');
    console.log(test.name + ' > FAILURE (' + failureSummary + ')');
    logger.failure(testcase, logs);
  }

}

module.exports = {
  success,
  failure,
  addEvaluator,
  evaluate
};