function getDetails(detail, test, student, reference) {
  let msg = '';
  let failureReason = '';

  switch (detail) {
    case 'stdout':
      failureReason = 'Output differs';
      break;
    case 'stderr':
      failureReason = 'Output differs';
      break;
    case 'crash':
      failureReason = 'Program crashed';
      break;
    case 'timeout':
      failureReason = 'Timed out';
      break;
    case 'returnValue':
      failureReason = 'Bad return value';
      break;
  }

  msg += `Failure reason: ${failureReason}\n`;
  msg += `Executed shell command: ${test.finalCommand}\n`;
  msg += `Process exit signal: ${student.crash ? student.crash : 'None (process exited normally)'}\n`;

  msg += `Process exit status: ${student.returnValue !== null ? student.returnValue : '-'}`;
  if ((reference && typeof reference.returnValue === 'number') || typeof test.returnValue === 'number') {
    msg += ` (expected ${reference ? reference.returnValue : test.returnValue})\n\n`;
  } else {
    msg += '\n';
  }

  msg += `============== STDOUT ==============\n`;
  msg += student.stdout || '';
  msg += `====================================\n\n`;

  msg += `============== STDERR ==============\n`;
  msg += student.stderr || '';
  msg += `====================================\n\n`;

  if (reference || test.stdout) {
    msg += `========= EXCPECTED STDOUT =========\n`;
    msg += reference ? reference.stdout || '\n' : test.stdout || '';
    msg += `====================================\n\n`;
  }

  if (reference || test.stderr) {
    msg += `========= EXCPECTED STDERR =========\n`;
    msg += reference ? reference.stderr || '\n' : test.stderr || '';
    msg += `====================================\n\n`;
  }

  return msg;
}

function success(test, student, reference, __results) {
  __results.ele('testcase', {
    name: test.name.split('.')[2],
    classname: test.name.split('.')[0] + '.' + test.name.split('.')[1],
  });

  console.log(test.name + ' > SUCCESS');
}

function failure(detail, test, student, reference, __results) {
  const testcase = __results.ele('testcase', {
    name: test.name.split('.')[2],
    classname: test.name.split('.')[0] + '.' + test.name.split('.')[1],
  });

  if (detail === 'crash' || detail === 'timeout') {
    testcase.ele('error', {
      message: 'Test crashed'
    }, getDetails(detail, test, student, reference));
  } else {
    testcase.ele('failure', {
      message: 'Test failed'
    }, getDetails(detail, test, student, reference));
  }

  console.log(test.name + ' > FAILURE (' + detail + ')');
}

module.exports = {
  success,
  failure
};