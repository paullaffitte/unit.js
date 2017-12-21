#! /usr/bin/env node

const unit = require('../unit.js');

unit.reference('ref');

unit.test({
  name: 'Package.Class.Name1'
});

unit.run();