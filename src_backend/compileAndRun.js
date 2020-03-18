const { mkdir, writeFile } = require('fs')
const path = require('path')
const { execFile } = require('child_process')

const appRoot = path.dirname(require.main.filename)
const executionTimeoutMs = 15000 // 15 second timeout

/**
 * Compiles and runs the given java file through its example classes, returning the output or nothing on timeout
 * @param {string} fileName the full file name of the java file
 * @param {string[]} examplesClasses a list example classes to be used for the Tester library
 * @param {string} javaCode the java code to be compiled
 * @param {string} roomDir the room directory
 * @returns {string} the output of running the java code including runtime and compile time errors, or nothing on timeout
 */
function compileAndRun (fileName, examplesClasses, javaCode, roomDir) {
  // might want to be outside this function to return a better message or something?
  const regex = /room-[a-z]+-[a-z]+-[0-9]+/
  if (!regex.test(roomDir)) {
    return ''
  }
  //room - [a - z] + -[a - z] + -[0 - 9] +
  return new Promise(function (resolve, reject) {
    mkdir(roomDir, err => {
      if (err && err.code !== 'EEXIST') {
        return reject(err)
      }

      writeFile(roomDir + '/' + fileName, javaCode, function (err) {
        if (err) {
          return reject(err)
        }

        const examplesClassesString = examplesClasses.join(' ')
        const command = `javac -cp .:tester.jar:javalib.jar -d ./${roomDir} ./${roomDir}/${fileName} && java -classpath ./${roomDir}:tester.jar:javalib.jar tester.Main ${examplesClassesString}`

        execFile(
          'docker',
          [...dockerArguments(roomDir), command],
          { timeout: executionTimeoutMs },
          (error, stdout, stderr) => {
            if (error) {
              console.log('compilation error')
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
 * Return arguments to use for running docker for a given roomDir
 * @param roomDir the roomDir for this run
 * @returns {string[]} docker arguments
 */
function dockerArguments (roomDir) {
  return [
    'run',
    '-t',
    '--rm',
    '--workdir=/app',
    '--volume',
    `${appRoot}/${roomDir}:/app/${roomDir}`,
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
