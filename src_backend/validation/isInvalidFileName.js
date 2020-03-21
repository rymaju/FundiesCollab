const fileNameRegex = /^[A-z]+.java$/
const ensureString = require('type/string/ensure')
const fileNameMaxLen = 100

/**
 * is the given file name invalid?
 * @param {string} fileName
 * @returns {boolean}
 */
function isInvalidFileName (fileName) {
  return (
    !ensureString(fileName) ||
    !fileNameRegex.test(fileName) ||
    fileName.length >= fileNameMaxLen
  )
}

module.exports = isInvalidFileName
