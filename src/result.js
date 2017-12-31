function getDetails(detail, test, student, reference) {
  let msg = '';

  msg += `Executed shell command: ${test.finalCommand}\n`;
  msg += `Process exit signal: ${student.crash ? student.crash : 'None (process exited normally)'}\n`;

  msg += `Process exit status: ${student.returnValue}`;
  if (reference || test.returnValue) {
    msg += ` (expected ${reference ? reference.returnValue : test.returnValue})\n\n`;
  } else {
    msg += '\n';
  }

  msg += `============== STDOUT ==============\n`;
  msg += student.stdout || '\n';
  msg += `====================================\n\n`;

  msg += `============== STDERR ==============\n`;
  msg += student.stderr || '\n';
  msg += `====================================\n\n`;

  if (reference || test.stdout) {
    msg += `========= EXCPECTED STDOUT =========\n`;
    msg += reference ? reference.stdout || '\n' : test.stdout || '\n';
    msg += `====================================\n\n`;
  }

  if (reference || test.stderr) {
    msg += `========= EXCPECTED STDERR =========\n`;
    msg += reference ? reference.stderr || '\n' : test.stderr || '\n';
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