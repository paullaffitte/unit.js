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

function template(options) {
	pipeline.push({
		action: 'template',
		options: options
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

function custom(callback) {
	pipeline.push({
		action: 'custom',
		options: {
			callback: callback
		}
	});
}

module.exports = {
  pipeline,
  binary,
	reference,
	template,
	test,
	custom,
  cmd
};