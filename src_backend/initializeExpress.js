const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compileRouter = require('./compileRouter')
const roomRouter = require('./roomRouter')

const appRoot = path.dirname(require.main.filename)

/**
 * Initalizes the express app
 * @returns the express app
 */
function init () {
  const app = express()

  const apiLimiter = rateLimit({
    windowMs: 1000 * 60 * 10, // 10 minutes
    max: 20 // limit each IP to 20 requests per 10 minutes
  })

  app.use(cors()) // Here we enable cors
  app.use(helmet()) // helmet is a medley of security middleware to better protect our app
  app.use(express.json()) // Built in body-parser for reading request JSON bodies
  app.use('/api/', apiLimiter) // use the apiLimiter only on routes beginning with /api
  app.use(express.static(path.join(appRoot, '/dist'))) // host the static files built from React
  app.use('/api/compile', compileRouter) // mount the subrouter
  app.use('/api/room', roomRouter) // mount the subrouter

  // If the route cannot be identified, send the index.html file and let react router route instead

  app.get('*', function (req, res) {
    res.sendFile(path.join(appRoot, '/dist/index.html'), function (err) {
      if (err) {
        res.redirect('/')
      }
    })
  })

  return app
}

module.exports = init
