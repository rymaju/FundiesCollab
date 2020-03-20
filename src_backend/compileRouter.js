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
  const hsEnd = process.hrtime.bigint()
  const timeMs = (hsEnd - hrStart) / 1000000
  console.log(`${timeMs}ms`)
  histogram.update(timeMs)
}

router.route('/java').post((req, res) => {
  console.log('new request')

  const hrStart = process.hrtime.bigint()
  console.log(new Date())

  validateInput(req, res)
    .then(input => {
      compileAndRun(
        input.fileName,
        input.examplesClasses,
        input.javaCode,
        'room-' + input.roomId
      )
        .then(out => {
          console.log(`Request from room-${input.roomId} took:`)
          endTimer(hrStart)

          console.log(new Date())

          console.log(process.hrtime(hrStart))
          if (out === '') {
            res
              .status(400)
              .json({ err: 'Java execution timed out' })
              .end()
          } else {
            res
              .status(200)
              .json({ out })
              .end()
          }
        })
        .catch(err => {
          console.error(`Error in room ${input.roomId}: ${err}`)
          endTimer(hrStart)

          res.status(500).end()
        })
    })
    .catch(err => {
      console.error(err)
      endTimer(hrStart)

      res
        .status(400)
        .json({ err: err.toString() })
        .end()
    })
})

router.route('/racket').post((req, res) => {
  res.send('Not implemented yet!')
})

module.exports = router
