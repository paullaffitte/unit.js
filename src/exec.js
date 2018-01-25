const exec = require('child_process').exec;

function prepareTrace(cmd, err, stdout, stderr) {

  let trace = {
    cmd: cmd,
    stdout: stdout,
    stderr: stderr,
    returnValue: err ? err.code : 0,
  };

  if (err) {
    trace.error = {
      signal: err.code === 139 ? 'SIGSEGV' : err.signal,
      label: err.killed ? 'timeout' : 'crash'
    };
  }
  return trace;
}

function execAndTrace(cmd, timeout) {
  timeout = timeout ? timeout : 3000;
  return new Promise(function(resolve, reject) {
    if (!cmd)
      resolve(null);
    else
      exec(cmd, {
        timeout: timeout,
        killSignal: 'SIGTERM'
      }, (err, stdout, stderr) => {
        resolve(prepareTrace(cmd, err, stdout, stderr));
      });
  });
}

module.exports = {
  execAndTrace
};
