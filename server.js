const init = require('./src_backend/initializeExpress')
const socketSetup = require('./src_backend/socket')
const cronjobSetup = require('./src_backend/cronjob')

// setup the express server
const app = init(__dirname)
const port = process.env.PORT || 5000

// launch the express server
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

// An associative array of rooms ({code, lastActiveDateTime}), keyed by their room ID
const roomData = {}

// setup the socket connections for rooms
socketSetup(server, roomData)
// setup the cron job to delete rooms that have not been used in over a week
cronjobSetup(roomData)
