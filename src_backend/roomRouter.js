const router = require('express').Router()
const roomData = require('./roomData')

router.route('/:id').get(async (req, res) => {
  const roomId = req.params.id

  const containsRoom = (await roomData.get(roomId)) !== undefined

  res
    .send(200)
    .json({ exists: containsRoom })
    .end()
})

module.exports = router
