#! /usr/bin/env node
const unit = require('../unit');

// unit.reference('/usr/bin/tcsh');
unit.binary('./42sh');

unit.cmd('gcc -o 42sh main.c');

unit.test({
  name: 'Package.Class 2.Test 3',
  returnValue: 0
});

unit.run();

// unit.binary('./student');
//
// unit.cmd('gcc test_1.c -lmy_printf -o student');
// unit.test({
//   name: 'Package.Class.Test 1',
//   stdout: 'Salut\n',
//   returnValue: 0
// });
//
// unit.cmd('gcc test_gestion_d_erreur.c -lmy_printf -o student');
// unit.test({
//   name: 'Package.Class.Test Erreur',
//   stderr: 'Error!\n',
//   returnValue: 84
// });