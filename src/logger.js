function testcase(test) {
  const splitedName = test.name.split('.');
  return __results.ele('testcase', {
    name: splitedName[2],
    classname: splitedName[0] + '.' + splitedName[1],
  });
}

function failure(testcase, details) {
  return testcase.ele('error', {
    message: 'Test crashed'
  }, details);
}

function error(testcase, details) {
  return testcase.ele('error', {
    message: 'Test crashed'
  }, details);
}

module.exports = {
  testcase,
  failure,
  error
};