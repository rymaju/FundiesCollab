const ensureString = require('type/string/ensure')
const roomIdRegex = /^[a-zA-Z0-9-_]+/

/**
 * is the given room ID invalid?
 * @param {string} roomId
 * @returns {boolean}
 */
function isInvalidRoomId (roomId) {
  return !ensureString(roomId) || !roomIdRegex.test(roomId)
}

module.exports = isInvalidRoomId
