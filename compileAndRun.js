const fs = require('fs')

const { execFile, exec } = require('child_process')

// compiles and runs the given java file with the correct examples classes given the name, list of examples, and code
// EFFECT: creates a java file, runs and compiles it, returning the output
// compileAndRun : String [List-of String] String -> [Promise String]
function compileAndRun (fileName, examplesClasses, javaCode, roomId) {
  return new Promise(function (resolve, reject) {
    exec('mkdir ' + roomId, { timeout: 10000 }, (error, stdout, stderr) => {
      fs.writeFile(roomId + '/' + fileName, javaCode, function (err) {
        if (err) {
          reject(err)
        }
        console.log('The file was saved!')

        execFile(
          'javac',
          [
            '-cp',
            '.;tester.jar;javalib.jar',
            '-d',
            './' + roomId,
            './' + roomId + '/' + fileName
          ],
          { timeout: 10000 },
          (error, stdout, stderr) => {
            if (error) {
              resolve(stderr)
            }

            console.log('Compilation complete')

            execFile(
              'java',
              [
                '-classpath',
                './' + roomId + ';tester.jar;javalib.jar',
                'tester.Main'
              ].concat(examplesClasses),
              { timeout: 10000 },
              (error, stdout, stderr) => {
                if (error) {
                  resolve(stderr)
                }
                console.log('run complete returning response...')
                resolve(stdout)
              }
            )
          }
        )
      })
    })
  })
}

module.exports = compileAndRun
