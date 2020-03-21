const { execFile } = require('child_process')

/**
 * Compiles and runs the given java file through its example classes, or on rejection returns an http-error
 * @param {string} fileName the full file name of the java file
 * @param {string} examplesClasses a space delimited list of example classes to be used for the Tester library
 * @param {string} javaCode the java code to be compiled
 * @param {string} roomDir the room directory
 * @returns {Promise<string>} the output of running the java code including runtime and compile time errors
 */
async function execFilePromise (file, args, options) {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr })
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

module.exports = execFilePromise
