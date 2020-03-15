const router = require('express').Router()
const compileAndRun = require('../compileAndRun')
const uuid = require('uuid')

router.route('/java').post((req, res) => {
  const fileName = req.body.fileName
  const examplesClasses = req.body.examplesClasses
  const javaCode = req.body.javaCode
  const roomId = req.body.roomId

  compileAndRun(fileName, examplesClasses, javaCode, 'room-' + roomId)
    .then(out => res.json({ out }))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.route('/racket').post((req, res) => {
  res.send('Not implemented yet!')
})

module.exports = router
