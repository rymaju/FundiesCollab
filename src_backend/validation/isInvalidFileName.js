const fileNameRegex = /^[A-z]+.java$/
const ensureString = require('type/string/ensure')
const fileNameMaxLen = 100

function isInvalidFileName(fileName) {
  return (
    !ensureString(fileName) ||
    !fileNameRegex.test(fileName) ||
    fileName.length >= fileNameMaxLen
  )
}

module.exports = isInvalidFileName