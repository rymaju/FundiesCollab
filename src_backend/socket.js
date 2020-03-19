const socketIO = require('socket.io')

const pm2io = require('@pm2/io')
const roomData = require('./roomData')

const counter = pm2io.counter({
  name: 'Active socket connections'
})

function socketSetup (server) {
  const io = socketIO(server)

  io.on('connection', socket => {
    //console.log('a user connected')
    counter.inc()

    socket.on('disconnect', () => {
      //console.log('user disconnected')
      counter.dec()
    })

    socket.on('join room', function (data) {
      const roomId = data.room

      socket.join(roomId)

      roomData
        .get(roomId)
        .then(newCode => {
          io.to(`${socket.id}`).emit('sync code', { newCode })
        })
        .catch(err => {
          console.error(err)
        })
    })

    socket.on('leave room', data => {
      socket.leave(data.room)
    })

    socket.on('send code', function (data) {
      const roomId = data.room
      const newCode = data.newCode
      roomData.set(roomId, newCode).catch(err => {
        console.error(err)
      })

      socket.broadcast.to(roomId).emit('sync code', { newCode })
    })
  })
}

module.exports = socketSetup
