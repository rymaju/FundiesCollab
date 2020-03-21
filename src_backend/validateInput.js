const createError = require('http-errors')

const isInvalidFileName = require('./validation/isInvalidFileName')
const isInvalidExamplesClasses = require('./validation/isInvalidExamplesClasses')
const isInvalidJavaCode = require('./validation/isInvalidJavaCode')
const isInvalidRoomId = require('./validation/isInvalidRoomId')

/**
 * Validates the request body parameters and returns the validated body, or on rejection returns an http-error
 * @param {Request<ParamsDictionary, any, any>} req request object
 * @returns {{fileName : string, examplesClasses : string[], javaCode : string, roomId : string}|HttpError>} the validated request body parameters
 */
function validateInput (req) {
  const fileName = req.body.fileName
  const examplesClasses = req.body.examplesClasses
  const javaCode = req.body.javaCode
  const roomId = req.body.roomId

  if (isInvalidFileName(fileName)) {
    throw createError(
      400,
      `Invalid file name: "${fileName}". Must be a valid .java file name and must not be too long.`
    )
  } else if (isInvalidExamplesClasses(examplesClasses)) {
    throw createError(
      400,
      `Invalid examples classes: ${examplesClasses} must be an array of valid Java class names and must not be too long.`
    )
  } else if (isInvalidJavaCode(javaCode)) {
    throw createError(400, 'Invalid java code. Submitted code was too long.')
  } else if (isInvalidRoomId(roomId)) {
    throw createError(
      400,
      `Invalid room ID: ${roomId}. Room ID must be in the Haikunator format of abcd-abcd-1234.`
    )
  } else {
    const validatedBody = {
      fileName,
      examplesClasses,
      javaCode,
      roomId
    }

    return validatedBody
  }
}

module.exports = validateInput
