const router = require('express').Router()
const compileAndRun = require('./compileAndRun')

router.route('/java').post((req, res) => {
  const fileName = req.body.fileName
  const examplesClasses = req.body.examplesClasses
  const javaCode = req.body.javaCode
  const roomId = req.body.roomId

  function successCallback (result) {
    console.log(`Compilation took`)
    console.timeEnd('exampleCompileAndRun')

    if (result === '') {
      res.status(408).end()
    } else {
      res
        .status(200)
        .json({ result })
        .end()
    }
  }

  function failureCallback (error) {
    console.log(`Error: ${error}`)
    console.timeEnd('exampleCompileAndRun')
    res.status(500).end()
  }

  console.time('exampleCompileAndRun')

  compileAndRun(fileName, examplesClasses, javaCode, 'room-' + roomId).then(
    successCallback,
    failureCallback
  )
})

router.route('/racket').post((req, res) => {
  res.send('Not implemented yet!')
})

module.exports = router
