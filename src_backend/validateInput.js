const roomData = require('./roomData')

/**
 * Validates the request body parameters and returns the validated body
 * @param {Request<ParamsDictionary, any, any>} req request object
 * @param {Response<any>} res response object
 * @returns {Promise<{fileName : string, examplesClasses : string[], javaCode : string, roomId : string}>} the new RoomData connection
 */
function validateInput (req, res) {
  return new Promise((resolve, reject) => {
    const fileName = req.body.fileName
    const examplesClasses = req.body.examplesClasses.join(' ')
    const javaCode = req.body.javaCode
    const roomId = req.body.roomId

    const fileNameRegex = /^[A-z]+.java$/
    const examplesClassesRegex = /^[A-z]+(\s[A-z]+)*$/
    const roomIdRegex = /^[a-z]+-[a-z]+-[0-9]+$/

    const fileNameMaxLen = 100
    const examplesClassesMaxLen = 500
    const javaCodeMaxLen = 25000

    if (!fileNameRegex.test(fileName) || fileName.length >= fileNameMaxLen) {
      reject(new Error(`Bad file name "${fileName}"`))
    } else if (
      !examplesClassesRegex.test(examplesClasses) ||
      examplesClasses.length >= examplesClassesMaxLen
    ) {
      reject(new Error(`Bad examples class: "${examplesClasses}"`))
    } else if (javaCode.length >= javaCodeMaxLen) {
      reject(
        new Error(
          `Submitted code is over the limit of ${javaCodeMaxLen} characters`
        )
      )
    } else if (!roomIdRegex.test(roomId)) {
      reject(new Error('Invalid room id'))
    } else {
      roomData.isFull().then(isFull => {
        if (isFull) {
          reject(
            new Error(
              `Max capacity of ${roomData.capacity} rooms reached. Please wait for rooms to be deallocated.`
            )
          )
        } else {
          resolve({ fileName, examplesClasses, javaCode, roomId })
        }
      })
    }
  })
}

module.exports = validateInput
