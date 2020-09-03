const router = require('express').Router()
const pm2io = require('@pm2/io')

const authMiddleware = require('./authMiddleware')
const compileAndRun = require('./compileAndRun')
const validateInput = require('./validateInput')

const histogram = pm2io.histogram({
  name: 'Mean Latency',
  measurement: 'mean'
})

/**
 * Represents a error for HTTP responses
 * @typedef {Object} HttpError
 * @property {boolean} expose  - an be used to signal if message should be sent to the client, defaulting to false when status >= 500
 * @property {Object} headers - can be an object of header names to values to be sent to the client, defaulting to undefined. When defined, the key names should all be lower-cased
 * @property {string} message - the traditional error message, which should be kept short and all single line
 * @property {number} status - the status code of the error, mirroring statusCode for general compatibility
 * @property {number} statusCode - the status code of the error, defaulting to 500
 */

/**
 * ends the timer and adds the value to the histogram
 * @param {[number, number]} hrStart the start of the timer given by process.hrtime()
 */
function endTimer (hrStart) {
  const hsEnd = process.hrtime(hrStart)
  const secondsAsMs = hsEnd[0] * 1000
  const nanoAsMs = hsEnd[1] / 1000000
  const timeMs = secondsAsMs + nanoAsMs
  console.log(`${timeMs}ms`)
  histogram.update(timeMs)
}

/**
 * handles the response to an http error
 * @param {Response} res the response object
 * @param {HttpError} httpError the http error
 */
function handleHttpError (res, httpError) {
  console.error(httpError)
  res
    .status(httpError.status)
    .json({
      err: httpError.expose ? httpError.message : 'Internal Server Error'
    })
    .end()
}
function handleSuccessfulCompile (res, output, roomId) {
  console.log(`Request from room-${roomId} successful!`)

  res
    .status(200)
    .json({ out: output })
    .end()
}

router.route('/java').post(authMiddleware, async (req, res) => {
  const hrStart = process.hrtime()

  try {
    const { fileName, examplesClasses, javaCode, roomId } = await validateInput(
      req, true
    )
    const output = await compileAndRun(
      fileName,
      examplesClasses,
      javaCode,
      roomId,
      true
    )
    handleSuccessfulCompile(res, output, roomId)
  } catch (error) {
    handleHttpError(res, error)
  } finally {
    endTimer(hrStart)
  }
})

router.route('/racket').post(authMiddleware, async (req, res) => {
  const hrStart = process.hrtime()

  try {
    const { fileName, _, racketCode, roomId } = await validateInput(
      req, false
    )
    const output = await compileAndRun(
      fileName,
      '',
      racketCode,
      roomId,
      false
    )
    handleSuccessfulCompile(res, output, roomId)
  } catch (error) {
    handleHttpError(res, error)
  } finally {
    endTimer(hrStart)
  }
})

module.exports = router
