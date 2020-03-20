const roomData = require('./roomData')
const createError = require('http-errors')
const ensureString = require('type/string/ensure')
const ensureArray = require('type/array/ensure')

/**
 * Validates the request body parameters and returns the validated body, or on rejection returns an http-error
 * @param {Request<ParamsDictionary, any, any>} req request object
 * @param {Response<any>} res response object
 * @returns {Promise<{fileName : string, examplesClasses : string[], javaCode : string, roomId : string}>} the new RoomData connection
 */
function validateInput (req, res) {
  return new Promise((resolve, reject) => {
    const fileName = req.body.fileName
    const examplesClasses = req.body.examplesClasses
    const javaCode = req.body.javaCode
    const roomId = req.body.roomId

    const fileNameRegex = /^[A-z]+.java$/
    const examplesClassesRegex = /^[A-z]+(\s[A-z]+)*$/
    const roomIdRegex = /^[a-z]+-[a-z]+-[0-9]+$/

    const fileNameMaxLen = 100
    const examplesClassesMaxLen = 500
    const javaCodeMaxLen = 25000

    if (
      !ensureString(fileName) ||
      !fileNameRegex.test(fileName) ||
      fileName.length >= fileNameMaxLen
    ) {
      reject(
        createError(
          400,
          `Invalid file name: "${fileName}". Must be a valid .java file name and be less than ${fileNameMaxLen} characters.`
        )
      )
    } else if (
      !ensureArray(examplesClasses) ||
      !examplesClassesRegex.test(examplesClasses.join(' ')) ||
      examplesClasses.join(' ').length >= examplesClassesMaxLen
    ) {
      reject(
        createError(
          400,
          `Invalid examples classes: ${examplesClasses} must be an array of valid Java class names, whose length when joined by spaces is less than ${examplesClassesMaxLen} chars`
        )
      )
    } else if (javaCode.length >= javaCodeMaxLen) {
      reject(
        createError(
          400,
          `Invalid java code. Submited code must be less than ${javaCodeMaxLen} characters`
        )
      )
    } else if (!ensureString(fileName) || !roomIdRegex.test(roomId)) {
      reject(
        createError(
          400,
          `Invalid room ID: ${roomId}. Room ID must be in the Haikunator format of abcd-abcd-1234.`
        )
      )
    } else {
      roomData.isFull().then(isFull => {
        if (isFull) {
          reject(
            createError(
              507,
              'Maximum room storage reached. Wait until rooms expire and try again.'
            )
          )
        } else {
          resolve({
            fileName,
            examplesClasses: examplesClasses.join(' '),
            javaCode,
            roomId
          })
        }
      })
    }
  })
}

module.exports = validateInput
