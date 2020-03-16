const socketIO = require('socket.io')

function socketSetup (server, roomData) {
  const io = socketIO(server)

  io.on('connection', socket => {
    //console.log('a user connected')

    socket.on('disconnect', () => {
      //console.log('user disconnected')
    })

    socket.on('join room', function (data) {
      socket.join(data.room)
      if (roomData[data.room]) {

        io.to(`${socket.id}`).emit('sync code', {
          newCode: roomData[data.room].code
        })

        roomData[data.room] = {
          code: roomData[data.room].code,
          lastActiveDateTime: new Date()
        }
      }
    })

    socket.on('leave room', data => {
      socket.leave(data.room)
    })

    socket.on('send code', function (data) {
      roomData[data.room] = {
        code: data.newCode,
        lastActiveDateTime: new Date()
      }

      socket.broadcast
        .to(data.room)
        .emit('sync code', { newCode: data.newCode })
    })
  })
}

module.exports = socketSetup
