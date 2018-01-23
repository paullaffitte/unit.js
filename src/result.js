const logger = require('./logger');

function getDetails(test, student, reference) {
  let msg = '';
  let exitSignal = 'None (process exited normally)';

  if (student.error) {
    exitSignal = `${student.error.signal} [${student.error.label}]`;
  }

  msg += `Executed shell command: ${test.cmd}\n`;
  msg += `Process exit signal: ${exitSignal}\n`;
  msg += `Process exit status: ${student.returnValue}`;
  return msg;
}

function success(test, student, reference, __results) {
  logger.testcase(test);
  console.log(test.name + ' > SUCCESS');
}

function failure(test, student, reference, __results) {
  let testcase = logger.testcase(test);

  if (student.error) {
    console.log(test.name + ' > ERROR (' + detail + ')');
    logger.error(testcase, details);
  } else {
    console.log(test.name + ' > FAILURE (' + detail + ')');
    logger.failure(testcase, details);
  }

}

module.exports = {
  success,
  failure
};