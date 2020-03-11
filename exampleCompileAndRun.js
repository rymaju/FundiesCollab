const fileName = 'Huffman.java'
const examplesClasses = ['ExamplesHuffman']
const javaCode = require('./exampleJavaCode')

const compileAndRun = require('./compileAndRun')

const uuid = require('uuid')

compileAndRun(fileName, examplesClasses, javaCode, 'room-' + uuid.v4())
  .then(out => console.log(out))
  .catch()
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
