const router = require('express').Router()
const compileAndRun = require('../compileAndRun')
router.route('/java').post((req, res) => {
  console.log(req.body)

  const fileName = req.body.fileName
  const examplesClasses = req.body.examplesClasses
  const javaCode = req.body.javaCode

  compileAndRun(fileName, examplesClasses, javaCode)
    .then(out => res.json(out))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.route('/racket').post((req, res) => {
  res.send('Not implemented yet!')
})

module.exports = router
