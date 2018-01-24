const logger = require('./logger');

let _evaluators = {};

function addEvaluator(evaluatorName, evaluator) {
  _evaluators[evaluatorName] = evaluator;
}

function evaluate(test, student, reference, __results) {
  if (student.error) {
    failure(test, student, __results);
    return next();
  }

  const evaluator = _evaluators[test.evaluator.method];
  let result = evaluator(student, reference);
  if (result && !result.success) {
    failure(test, student, result, __results);
  } else {
    success(test, result, __results);
  }
}

function getLogs(test, student, result) {
  let msg = result.message ? result.message : '';
  let exitSignal = 'None (process exited normally)';

  if (student.error) {
    exitSignal = `${student.error.signal} [${student.error.label}]`;
  }

  msg += `Executed shell command: ${test.cmd}\n`;
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
    console.log(test.name + ' > FAILURE (' + result.summary + ')');
    logger.failure(testcase, logs);
  }

}

module.exports = {
  success,
  failure,
  addEvaluator,
  evaluate
};