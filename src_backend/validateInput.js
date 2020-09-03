const createError = require('http-errors')

const isInvalidFileName = require('./validation/isInvalidFileName')
const isInvalidExamplesClasses = require('./validation/isInvalidExamplesClasses')
const isInvalidCode = require('./validation/isInvalidJavaCode')
const isInvalidRoomId = require('./validation/isInvalidRoomId')

/**
 * Validates the request body parameters and returns the validated body, or on rejection returns an http-error
 * @param {Request<ParamsDictionary, any, any>} req request object
 * @param {boolean} inJava whether the request is for a Java compilation
 * @returns {{fileName : string, examplesClasses : string[], code : string, roomId : string}|HttpError>} the validated request body parameters
 */
function validateInput (req, inJava) {
  const fileName = req.body.fileName
  const examplesClasses = req.body.examplesClasses
  const code = req.body.code
  const roomId = req.body.roomId

  //TODO: add validation for Racket
  
  if (inJava && isInvalidFileName(fileName)) {
    throw createError(
      400,
      `Invalid file name: "${fileName}". Must be a valid .java file name and must not be too long.`
    )
  } else if (inJava && isInvalidExamplesClasses(examplesClasses)) {
    throw createError(
      400,
      `Invalid examples classes: ${examplesClasses} must be an array of valid Java class names and must not be too long.`
    )
  } else if (isInvalidCode(code)) {
    throw createError(400, 'Invalid code. Submitted code was too long.')
  } else if (isInvalidRoomId(roomId)) {
    throw createError(
      400,
      `Invalid room ID: ${roomId}. Room ID must be in the Haikunator format of abcd-abcd-1234.`
    )
  } else {
    const validatedBody = {
      fileName,
      examplesClasses: examplesClasses.join(' '),
      code,
      roomId
    }

    return validatedBody
  }
}

module.exports = validateInput
