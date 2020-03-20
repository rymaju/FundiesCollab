const roomData = require('./roomData')
const createError = require('http-errors')
const ensureString = require('type/string/ensure')
const ensureArray = require('type/array/ensure')

const fileNameRegex = /^[A-z]+.java$/
const examplesClassesRegex = /^[A-z]+(\s[A-z]+)*$/
const roomIdRegex = /^[a-z]+-[a-z]+-[0-9]+$/

const fileNameMaxLen = 100
const examplesClassesMaxLen = 500
const javaCodeMaxLen = 25000

function isInvalidFileName (fileName) {
  return (
    !ensureString(fileName) ||
    !fileNameRegex.test(fileName) ||
    fileName.length >= fileNameMaxLen
  )
}

function isInvalidExamplesClasses (examplesClasses) {
  const examplesString = examplesClasses.join(' ')
  return (
    !ensureArray(examplesClasses) ||
    !examplesClassesRegex.test(examplesString) ||
    examplesString.length >= examplesClassesMaxLen
  )
}

function isInvalidJavaCode (javaCode) {
  return !ensureString(javaCode) || javaCode.length >= javaCodeMaxLen
}

function isInvalidRoomId (roomId) {
  return !ensureString(roomId) || !roomIdRegex.test(roomId)
}

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
      `Invalid file name: "${fileName}". Must be a valid .java file name and be less than ${fileNameMaxLen} characters.`
    )
  } else if (isInvalidExamplesClasses(examplesClasses)) {
    throw createError(
      400,
      `Invalid examples classes: ${examplesClasses} must be an array of valid Java class names, whose length when joined by spaces is less than ${examplesClassesMaxLen} chars`
    )
  } else if (isInvalidJavaCode(javaCode)) {
    throw createError(
      400,
      `Invalid java code. Submited code must be less than ${javaCodeMaxLen} characters`
    )
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
