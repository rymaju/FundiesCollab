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
function endTimer (hrstart) {
  const hsEnd = process.hrtime(hrstart)
  console.log(`${hsEnd[1] / 100000}ms`)
  histogram.update(hsEnd[1] / 100000)
}

router.route('/java').post((req, res) => {
  console.log('new request')

  const hrstart = process.hrtime()

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
          endTimer(hrstart)

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
          endTimer(hrstart)

          res.status(500).end()
        })
    })
    .catch(err => {
      console.error(err)
      endTimer(hrstart)

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
