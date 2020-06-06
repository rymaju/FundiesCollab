const auth = require('./firebaseAuth')

/**
 * Authentication middleware that uses firebase to verify JWT id tokens.
 *
 * @param {Request<any>} req
 * @param {Response<any>} res
 * @param {Function} next
 */
function authenticate (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]
    auth
      .verifyIdToken(token)
      .then(() => {
        next()
      })
      .catch(() => {
        res
          .status(401)
          .json({ err: 'Unauthorized token.' })
          .end()
      })
  } catch (err) {
    res
      .status(401)
      .json({ err: 'Malformed authorization header.' })
      .end()
  }
}

module.exports = authenticate
