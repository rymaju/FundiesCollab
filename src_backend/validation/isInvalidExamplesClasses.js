const ensureArray = require('type/array/ensure')
const examplesClassesRegex = /^[A-z]+(\s[A-z]+)*$/
const examplesClassesMaxLen = 500

/**
 * is the given examples classes array invalid?
 * @param {string[]} examplesClasses
 * @returns {boolean}
 */
function isInvalidExamplesClasses (examplesClasses) {
  const examplesString = examplesClasses.join(' ')
  return (
    !ensureArray(examplesClasses) ||
    !examplesClassesRegex.test(examplesString) ||
    examplesString.length >= examplesClassesMaxLen
  )
}

module.exports = isInvalidExamplesClasses
