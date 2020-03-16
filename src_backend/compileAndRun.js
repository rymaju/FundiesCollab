const fs = require('fs')
const path = require('path')

const { execFile, exec } = require('child_process')

const appRoot = path.dirname(require.main.filename)
const compileTimeoutMs = 10000 // 10 second timeout
const executionTimeoutMs = 20000 // 20 second timeout

// compiles and runs the given java file with the correct examples classes given the name, list of examples, and code
// EFFECT: creates a java file, runs and compiles it, returning the output
// compileAndRun : String [List-of String] String -> [Promise String]
function compileAndRun (fileName, examplesClasses, javaCode, roomId) {
  return new Promise(function (resolve, reject) {
    exec('mkdir ' + roomId, (error, stdout, stderr) => {
      fs.writeFile(roomId + '/' + fileName, javaCode, function (err) {
        if (err) {
          return reject(err)
        }
        //console.log('The file was saved!')

        execFile(
          'docker',
          [
            ...dockerArguments(roomId),
            'javac',
            '-cp',
            '.:tester.jar:javalib.jar',
            '-d',
            './' + roomId,
            './' + roomId + '/' + fileName
          ],
          { timeout: compileTimeoutMs },
          (error, stdout, stderr) => {
            if (error) {
              console.log('complation error')
              return resolve(stdout)
            }
            console.log('compiled without error')

            //console.log('Compilation complete')

            execFile(
              'docker',
              [
                ...dockerArguments(roomId),
                'java',
                '-classpath',
                './' + roomId + ':tester.jar:javalib.jar',
                'tester.Main'
              ].concat(examplesClasses),
              { timeout: executionTimeoutMs },
              (error, stdout, stderr) => {
                return resolve(stdout)
              }
            )
          }
        )
      })
    })
  })
}

/**
 * Return arguments to use for running docker for a given roomId
 * @param roomId the roomId for this run
 * @returns {string[]} docker arguments
 */
function dockerArguments (roomId) {
  return [
    'run',
    '-t',
    '--rm',
    '--workdir=/app',
    '--volume',
    `${appRoot}/${roomId}:/app/${roomId}`,
    '--volume',
    `${appRoot}/tester.jar:/app/tester.jar:ro`,
    '--volume',
    `${appRoot}/javalib.jar:/app/javalib.jar:ro`,
    'openjdk:11-jdk'
  ]
}

module.exports = compileAndRun
