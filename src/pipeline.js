let pipeline = [];

function success(info, stdout, stderr) {
  console.log('0:' + info.name);
}

function failure(info, stdout, stderr) {
  console.log('1:' + info.name);
}

function crash(info, stdout, stderr) {
  console.log('2:' + info.name);
}

function binary(path) {
  pipeline.push({
    action: 'binary',
    options: path
  });
}

function test(options) {
  pipeline.push({
    action: 'test',
    options: options,
  });
}

function cmd(cmd_string, callback) {
  pipeline.push({
    action: 'cmd',
    options: {
      litteral: cmd_string,
      callback: callback
    }
  });
}

module.exports = {
  pipeline,
  binary,
  test,
  cmd,
  success,
  failure,
  crash
};