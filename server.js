const express = require('express')
const cors = require('cors')
const path = require('path')

const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

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

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
