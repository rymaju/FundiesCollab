const router = require('express').Router()
const pm2io = require('@pm2/io')

const compileAndRun = require('./compileAndRun')
const validateInput = require('./validateInput')

const histogram = pm2io.histogram({
  name: 'java latency',
  measurement: 'mean'
})

/**
 * ends the timer and adds the value to the histogram
 * @param {[number, number]} hrStart the start of the timer given by process.hrtime()
 * @returns {void}
 */
function endTimer (hrStart) {
  const hsEnd = process.hrtime(hrStart)
  const secondsAsMs = hsEnd[0] * 1000
  const nanoAsMs = hsEnd[1] / 1000000
  const timeMs = secondsAsMs + nanoAsMs
  console.log(`${timeMs}ms`)
  histogram.update(timeMs)
}

function handleHttpError (res, httpError) {
  console.error(httpError)
  res
    .status(httpError.status)
    .json({
      err:
        httpError.status === 500 ? 'Internal Server Error' : httpError.message
    })
    .end()
}

router.route('/java').post((req, res) => {
  const hrStart = process.hrtime()

  try {
    const { fileName, examplesClasses, javaCode, roomId } = validateInput(req)
    compileAndRun(fileName, examplesClasses, javaCode, roomId)
      .then(out => {
        console.log(`Request from room-${req.body.roomId} successful!`)
        res
          .status(200)
          .json({ out })
          .end()
      })
      .catch(err => {
        handleHttpError(res, err)
      })
      .finally(() => {
        endTimer(hrStart)
      })
  } catch (error) {
    handleHttpError(res, error)
  }
})

router.route('/racket').post((req, res) => {
  res.send('Not implemented yet!')
})

module.exports = router
