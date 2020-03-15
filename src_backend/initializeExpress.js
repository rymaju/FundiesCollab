const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compileRouter = require('./routes/compile')

function init (rootDirectory) {
  const app = express()

  const apiLimiter = rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 5 // limit each IP to 5 requests per windowMs
  })

  app.use(cors()) // Here we protect against XSS by whitelisting origins
  app.use(helmet()) // helmet is a medley of security middleware to better protect our app
  app.use(express.json()) // Built in body-parser for reading request JSON bodies
  app.use('/api/', apiLimiter) // use the apiLimiter only on routes beginning with /api
  app.use(express.static(path.join(rootDirectory, '/build'))) // host the static files built from React
  app.use('/api/compile', compileRouter) // mount the subrouter

  // If the route cannot be identified, send the index.html file and let react router route instead
  app.get('*', function (req, res) {
    res.sendFile(path.join(rootDirectory, '/build/index.html'), function (err) {
      if (err) {
        res.redirect('/')
      }
    })
  })

  return app
}

module.exports = init
