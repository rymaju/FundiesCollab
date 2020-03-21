const socketIO = require('socket.io')

const pm2io = require('@pm2/io')
const roomData = require('./roomData')
const isInvalidJavaCode = require('./validation/isInvalidJavaCode')
const isInvalidRoomId = require('./validation/isInvalidRoomId')

const counter = pm2io.counter({
  name: 'Active Socket Connections'
})

/**
 * sets up the socket connections for the http server
 * @param {Server} server server connection
 */
function socketSetup (server) {
  const io = socketIO(server)

  io.on('connection', socket => {
    counter.inc()

    socket.on('disconnect', () => counter.dec())

    socket.on('join room', data => joinRoomHandler(io, socket, data.room))

    socket.on('leave room', data => socket.leave(data.room))

    socket.on('send code', data =>
      broadcastCodeHandler(socket, data.room, data.newCode)
    )
  })
}

/**
 * joins the room with the given room id, and if there already exists saved code for that room, then send back that code
 * @param {SocketIO.Server} io socket server connection
 * @param {SocketIO.Socket} socket socket server connection
 * @param {string} roomId the roomId
 */
async function joinRoomHandler (io, socket, roomId) {
  if (isInvalidRoomId(roomId)) {
    console.log(`attempted join of invalid room ${roomId}`)
    socket.disconnect(true)
  } else {
    socket.join(roomId)
    const newCode = await roomData.get(roomId).catch(err => console.error(err))
    if (newCode !== undefined) {
      io.to(`${socket.id}`).emit('sync code', { newCode })
    }
  }
}

/**
 * updates the code at roomId to the new code, and broadcasts this change to all other users in the room
 * @param {SocketIO.Socket} socket socket server connection
 * @param {string} roomId the roomId
 * @param {string} newCode the new code
 */
function broadcastCodeHandler (socket, roomId, newCode) {
  if (isInvalidRoomId(roomId) || isInvalidJavaCode(newCode)) {
    console.error(
      `attempted broadcast of invalid room or code: 
      ${roomId} 
      ${newCode}`
    )
    socket.disconnect(true)
  } else {
    roomData.set(roomId, newCode).catch(err => console.error(err))
    socket.broadcast.to(roomId).emit('sync code', { newCode })
  }
}

module.exports = socketSetup
