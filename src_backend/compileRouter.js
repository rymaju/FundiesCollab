const router = require('express').Router()
const pm2io = require('@pm2/io')
const { rmdir } = require('fs')

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

function deleteRoom (roomId) {
  // if another user is reading/writing to the file, then is should give an EBUSY error which is ok,
  // because whoever uses the dir last will eventually remove it
  const roomDir = 'room-' + roomId
  rmdir(roomDir, { recursive: true }, err => console.error(err))
}

router.route('/java').post((req, res) => {
  const hrStart = process.hrtime()

  validateInput(req, res)
    .then(input => {
      compileAndRun(
        input.fileName,
        input.examplesClasses,
        input.javaCode,
        'room-' + input.roomId
      )
        .then(out => {
          console.log(`Request from room-${req.body.roomId} took:`)
          endTimer(hrStart)

          deleteRoom(input.roomId)

          res
            .status(200)
            .json({ out })
            .end()
        })
        .catch(err => {
          console.error(err)
          endTimer(hrStart)

          deleteRoom(input.roomId)

          res
            .status(err.status)
            .json({
              err: err.status === 500 ? 'Internal Server Error' : err.message
            })
            .end()
        })
    })
    .catch(err => {
      console.error(err)
      endTimer(hrStart)

      res
        .status(err.status)
        .json({
          err: err.status === 500 ? 'Internal Server Error' : err.message
        })
        .end()
    })
})

router.route('/racket').post((req, res) => {
  res.send('Not implemented yet!')
})

module.exports = router
