const { execFile } = require('child_process')

/** Represents an error from execFile, including fields for the ExecException, stdout, and stderr*/
class ExecFileError extends Error {
  /**
   * @param {ExecException} error
   * @param {Buffer} stdout 
   * @param {Buffer} stderr
   */
  constructor (error, stdout, stderr) {
    super('Error occured when performing execFile()')
    this.error = error
    this.stdout = stdout
    this.stderr = stderr
  }
}

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
        reject(new ExecFileError(error, stdout, stderr))
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

module.exports = execFilePromise
