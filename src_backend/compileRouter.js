const router = require('express').Router()
const compileAndRun = require('./compileAndRun')
const io = require('@pm2/io')

const meter = io.meter({
  name: 'req/min',
  samples: 1,
  timeframe: 60
})

const counter = io.counter({
  name: 'Active requests'
})

const histogram = io.histogram({
  name: 'latency',
  measurement: 'mean'
})

router.route('/java').post((req, res) => {
  meter.mark()
  counter.inc()

  const fileName = req.body.fileName
  const examplesClasses = req.body.examplesClasses
  const javaCode = req.body.javaCode
  const roomId = req.body.roomId

  const hrstart = process.hrtime()

  compileAndRun(fileName, examplesClasses, javaCode, 'room-' + roomId)
    .then(out => {
      counter.dec()

      console.log(`Request from room-${roomId} took:`)
      const hsEnd = process.hrtime(hrstart)
      console.log(hsEnd)
      histogram.update(hsEnd)

      if (out === '') {
        res.status(400).end()
      } else {
        res
          .status(200)
          .json({ out })
          .end()
      }
    })
    .catch(err => {
      counter.dec()

      console.log(`Error in room ${roomId}: ${err}`)
      const hsEnd = process.hrtime(hrstart)
      console.log(hsEnd)
      histogram.update(hsEnd)

      res.status(500).end()
    })
})

router.route('/racket').post((req, res) => {
  res.send('Not implemented yet!')
})

module.exports = router
