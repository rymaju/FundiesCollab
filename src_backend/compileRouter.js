const router = require('express').Router()
const compileAndRun = require('./compileAndRun')
const pm2io = require('@pm2/io')

const histogram = pm2io.histogram({
  name: 'java latency',
  measurement: 'mean'
})

router.route('/java').post((req, res) => {
  const fileName = req.body.fileName
  const examplesClasses = req.body.examplesClasses
  const javaCode = req.body.javaCode
  const roomId = req.body.roomId

  const hrstart = process.hrtime()

  compileAndRun(fileName, examplesClasses, javaCode, 'room-' + roomId)
    .then(out => {
      console.log(`Request from room-${roomId} took:`)
      const hsEnd = process.hrtime(hrstart)
      console.log(`${hsEnd[1] / 100000}ms`)
      histogram.update(hsEnd[1] / 100000)

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
      console.log(`Error in room ${roomId}: ${err}`)
      const hsEnd = process.hrtime(hrstart)
      console.log(`${hsEnd[1] / 100000}ms`)
      histogram.update(hsEnd[1] / 100000)

      res.status(500).end()
    })
})

router.route('/racket').post((req, res) => {
  res.send('Not implemented yet!')
})

module.exports = router
