let pipeline = [];

function binary(path) {
  pipeline.push({
    action: 'binary',
    options: path
  });
}

function reference(path) {
  pipeline.push({
    action: 'reference',
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
      literal: cmd_string,
      callback: callback
    }
  });
}

module.exports = {
  pipeline,
  binary,
	reference,
	test,
  cmd
};