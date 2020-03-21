const ensureString = require('type/string/ensure')
const javaCodeMaxLen = 25000

function isInvalidJavaCode (javaCode) {
  return !ensureString(javaCode) || javaCode.length >= javaCodeMaxLen
}

module.exports = isInvalidJavaCode
