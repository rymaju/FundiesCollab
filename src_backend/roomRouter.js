const router = require('express').Router()
let Room = require('./room.model')

const maxRooms = 1000

const Haikunator = require('haikunator')
const haikunator = new Haikunator()

function generateRoomId () {
  return haikunator.haikunate({ tokenLength: 4 })
}

router.route('/new').post((req, res) => {
  Room.count({}, (err, count) => {
    if (count >= maxRooms) {
      const roomId = generateRoomId()
      const code = `test`
      const newRoom = new Room(roomId, code)

      newRoom
        .save()
        .then(room =>
          res
            .status(200)
            .json({ roomId })
            .end()
        )
        .catch(err =>
          res
            .status(400)
            .json(err)
            .end()
        )
    } else {
      res
        .status(400)
        .json(
          new Error(
            'Maximum number of rooms reached. Wait until rooms deallocate and try again.'
          )
        )
        .end()
    }
  })
})

module.exports = router
