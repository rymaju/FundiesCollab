const router = require('express').Router()
const roomData = require('./roomData')

router.route('/:id').get(async (req, res) => {
  const roomId = req.params.id

  const containsRoom = (await roomData.get(roomId)) !== undefined

  if (containsRoom) {
    res.send(200).end()
  } else {
    res.send(404).end()
  }
})

module.exports = router
