const ensureString = require('type/string/ensure')
const javaCodeMaxLen = 25000
/**
 * is the given java code invalid?
 * @param {string} javaCode
 * @returns {boolean}
 */
function isInvalidJavaCode (javaCode) {
  return !ensureString(javaCode) || javaCode.length >= javaCodeMaxLen
}

module.exports = isInvalidJavaCode
