const init = require('./src_backend/initializeExpress')
const socketSetup = require('./src_backend/socket')

// setup the express server
const app = init()
const port = process.env.PORT || 5000

// launch the express server
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

// setup the socket connections for rooms
socketSetup(server)
