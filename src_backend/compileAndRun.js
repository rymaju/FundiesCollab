const { promisify } = require('util')
const mkdir = promisify(require('fs').mkdir)
const writeFile = promisify(require('fs').writeFile)
const rmdir = promisify(require('fs').rmdir)
const execFile = require('./execFilePromise')

const path = require('path')
const createError = require('http-errors')

const appRoot = path.dirname(require.main.filename)
const executionTimeoutMs = 15000 // 15 second timeout

/**
 * Compiles and runs the given java file through its example classes, or on rejection returns an http-error
 * @param {string} fileName the full file name of the java file
 * @param {string} examplesClasses a space delimited list of example classes to be used for the Tester library
 * @param {string} javaCode the java code to be compiled
 * @param {string} roomDir the room directory
 * @returns {Promise<string | HttpError>} the output of running the java code including runtime and compile time errors, or nothing on timeout
 */
async function compileAndRun (fileName, examplesClasses, javaCode, roomDir) {
  await mkdir(roomDir).catch(handleMakeDirectoryError)
  const filePath = roomDir + '/' + fileName
  await writeFile(filePath, javaCode).catch(handleWriteFileError)

  const compileCommand = `javac -cp .:tester.jar:javalib.jar -d ./${roomDir} ./${roomDir}/${fileName}`
  const runCommand = `java -classpath ./${roomDir}:tester.jar:javalib.jar tester.Main ${examplesClasses}`

  const command = `${compileCommand} && ${runCommand}`

  try {
    const { stdout } = await execFile(
      'docker',
      [...dockerArguments(roomDir), command],
      { timeout: executionTimeoutMs }
    )
    console.log('file was compiled and run successfully')
    return stdout
  } catch (err) {
    return handleExecFileError(err)
  } finally {
    deleteRoom(roomDir)
  }
}

/**
 * Return arguments to use for running docker for a given roomDir
 * @param roomDir the room directory for this run
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

/**
 * removes the directory associated with the given room ID
 * @param {string} roomId
 */
function deleteRoom (roomDir) {
  // if another user is reading/writing to the file, then is should give an EBUSY error which is ok,
  // because whoever uses the dir last will eventually remove it

  rmdir(roomDir, { recursive: true }, err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`removed ${roomDir}`)
    }
  })
}
/**
 * throws the correct HttpError when an error is thrown creating a directory
 * @param {Error} err
 */
function handleMakeDirectoryError (err) {
  console.error(err)
  if (err.code === 'EEXIST') {
    throw createError(
      400,
      'Room is already being compiled. Wait for the current compilation to finish before compiling again.'
    )
  } else if (err) {
    throw createError(500, 'Error writing room directory')
  }
}

/**
 * throws the correct HttpError when an error is thrown writing to file
 * @param {Error} err
 */
function handleWriteFileError (err) {
  console.error(err)
  throw createError(500, 'Error writing java file')
}

/**
 * throws the correct HttpError when an error is thrown running the docker container that runs and compiles the java code
 * or returns the output if it was just a compilation error
 * @param {Error} err
 * @returns {string} compilation error output
 */
function handleExecFileError (err) {
  console.error(err)
  if (err.error.killed) {
    // process was killed by timeout
    throw createError(400, 'Java execution timed out')
  } else {
    console.log('compilation error')
    return err.stdout
  }
}

module.exports = compileAndRun
