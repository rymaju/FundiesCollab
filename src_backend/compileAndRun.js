const fs = require('fs')
const path = require('path')
const { execFile, exec } = require('child_process')

const appRoot = path.dirname(require.main.filename)
const executionTimeoutMs = 15000 // 15 second timeout

/**
 * Compiles and runs the given java file through its example classes, returning the output or nothing on timeout
 * @param {string} fileName the full file name of the java file
 * @param {string[]} examplesClasses a list example classes to be used for the Tester library
 * @param {string} javaCode the java code to be compiled
 * @param {string} roomId the room id
 * @returns {string} the output of running the java code including runtime and compile time errors, or nothing on timeout
 */
function compileAndRun (fileName, examplesClasses, javaCode, roomId) {
  return new Promise(function (resolve, reject) {
    exec('mkdir ' + roomId, (error, stdout, stderr) => {
      fs.writeFile(roomId + '/' + fileName, javaCode, function (err) {
        if (err) {
          return reject(err)
        }

        const examplesClassesString = examplesClasses.join(' ')
        const command = `"javac -cp .:tester.jar:javalib.jar -d ./${roomId} ./${roomId}/${fileName} && java -classpath ./${roomId}:tester.jar:javalib.jar tester.Main ${examplesClassesString}"`

        console.log(command)

        execFile(
          'docker',
          [...dockerArguments(roomId), command],
          { timeout: executionTimeoutMs },
          (error, stdout, stderr) => {
            if (error) {
              console.log('complation error')
              return resolve(stdout)
            }
            console.log('compiled without error')
            return resolve(stdout)
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
    'openjdk:11-jdk',
    '/bin/bash',
    '-c'
  ]
}

module.exports = compileAndRun
