const examplesClasses = ['ExamplesHuffman']
const javaCode = require('./exampleJavaCode')
const racketCode = require('./exampleRacketCode')

const compileAndRun = require('../compileAndRun')

// Run this file from the root directory:
// node src_backend/tests/exampleCompileAndRun.js

console.time('exampleCompileAndRunJava')
compileAndRun('Huffman.java', examplesClasses, javaCode, 'room-huffman', true)
  .then(out => {
    console.log('output:\n' + out)
    console.timeEnd('exampleCompileAndRunJava')
  })
  .catch(err => console.log(err))

console.time('exampleCompileAndRunRacket')
compileAndRun('test.rkt', examplesClasses, racketCode, 'room-racket', false)
  .then(out => {
    console.log('output:\n' + out)
    console.timeEnd('exampleCompileAndRunRacket')
  })
  .catch(err => console.log(err))
/*

The file was saved!
Compilation complete
Tester Library v.3.0
-----------------------------------
Tests defined in the class: ExamplesHuffman:
---------------------------
ExamplesHuffman:
---------------
new ExamplesHuffman:1(
 this.aloi = null
 this.aloi2 = null
 this.alos = null
 this.alos2 = null
 this.huff = null
 this.aloh = null
 this.aloh2 = null)
---------------

Ran 35 tests.
All tests passed.

--- END OF TEST RESULTS ---

  */
