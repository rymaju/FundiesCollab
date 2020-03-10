
const fs = require('fs')

const { execFile } = require('child_process')

// compiles and runs the given java file with the correct examples classes given the name, list of examples, and code
// EFFECT: creates a java file, runs and compiles it, returning the output
// compileAndRun : String [List-of String] String -> [Promise String]
function compileAndRun (fileName, examplesClasses, javaCode) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fileName, javaCode, function (err) {
      if (err) {
        reject(err)
      }
      console.log('The file was saved!')

      execFile(
        'javac',
        ['-cp', 'tester.jar', fileName],
        (error, stdout, stderr) => {
          if (error) {
            resolve(stderr)
          }

          console.log('Compilation complete')

          execFile(
            'java',
            ['-classpath', '.;tester.jar;', 'tester.Main'].concat(
              examplesClasses
            ),
            (error, stdout, stderr) => {
              if (error) {
                resolve(stderr)
              }

              resolve(stdout)
            }
          )
        }
      )
    })
  })
}

module.exports = compileAndRun
