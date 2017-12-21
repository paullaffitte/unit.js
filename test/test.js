#! /usr/bin/env node
const unit = require('../unit.js');

unit.reference('/usr/bin/tcsh');
unit.binary('42sh');

unit.test({
  name: 'Package.Class.Test 1',
  stdin: 'ls'
});

unit.run();