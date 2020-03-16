const fileName = 'Huffman.java'
const examplesClasses = ['ExamplesHuffman']
const javaCode = require('./exampleJavaCode')

const compileAndRun = require('./compileAndRun')

// Run this file from the root directory:
// node src_backend/exampleCompileAndRun.js

console.time('exampleCompileAndRun')
compileAndRun(fileName, examplesClasses, javaCode, 'room-huffman')
  .then(out => {
    console.log('output:\n' + out)
    console.timeEnd('exampleCompileAndRun')
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
