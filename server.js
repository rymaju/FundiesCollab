const express = require('express')
const cors = require('cors')
const path = require('path')
const socketIO = require('socket.io')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const deleteRoom = require('./deleteRoom')

const app = express()
const port = process.env.PORT || 5000

//https://i.redd.it/nu8nm8h1bvc41.jpg
const apiLimiter = rateLimit({
  windowMs: 1000 * 60, // 1 minute
  max: 5 // limit each IP to 5 requests per windowMs
})

app.use(cors()) // Here we protect against XSS by whitelisting origins
app.use(helmet()) // helmet is a medley of security middleware to better protect our app
app.use(express.json()) // Built in body-parser for reading request JSON bodies
app.use('/api/', apiLimiter)
app.use(express.static(path.join(__dirname, '/build')))

const compileRouter = require('./routes/compile')
app.use('/api/compile', compileRouter)

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/build/index.html'), function (err) {
    if (err) {
      res.redirect('/')
    }
  })
})

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

const io = socketIO(server)

const roomData = {}

io.on('connection', socket => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('join room', function (data) {
    socket.join(data.room)
    if (roomData[data.room]) {
      console.log('sending')
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
    socket.broadcast.to(data.room).emit('sync code', data)
  })
})

var CronJob = require('cron').CronJob
var job = new CronJob(
  '0 0 0 * * *',
  function () {
    console.log('running cron job')
    var oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    for (let roomId in roomData) {
      if (roomData.hasOwnProperty(roomId) && roomData[roomId] !== undefined) {
        const date = roomData[roomId].lastActiveDateTime
        if (oneWeekAgo > date) {
          delete roomData[roomId]
          deleteRoom(roomId)
          console.log('deleted room ' + roomId)
        }
      }
    }
  },
  null,
  true,
  'America/Los_Angeles'
)
job.start()
