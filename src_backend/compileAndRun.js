const fs = require('fs')
const path = require('path')

const { execFile, exec } = require('child_process')

const appRoot = path.dirname(require.main.filename)

// compiles and runs the given java file with the correct examples classes given the name, list of examples, and code
// EFFECT: creates a java file, runs and compiles it, returning the output
// compileAndRun : String [List-of String] String -> [Promise String]
function compileAndRun (fileName, examplesClasses, javaCode, roomId) {
  return new Promise(function (resolve, reject) {
    exec('mkdir ' + roomId, { timeout: 10000 }, (error, stdout, stderr) => {
      fs.writeFile(roomId + '/' + fileName, javaCode, function (err) {
        if (err) {
          reject(err)
          return
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
          { timeout: 10000 },
          (error, stdout, stderr) => {
            if (error) {
              resolve(stderr)
              return
            }

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
              { timeout: 10000 },
              (error, stdout, stderr) => {
                if (error) {
                  resolve(stderr)
                  return
                }
                //console.log('run complete returning response...')
                resolve(stdout)
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
