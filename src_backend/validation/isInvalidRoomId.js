const ensureString = require('type/string/ensure')
const roomIdRegex = /^[a-z]+-[a-z]+-[0-9]+$/

function isInvalidRoomId (roomId) {
  return !ensureString(roomId) || !roomIdRegex.test(roomId)
}

module.exports = isInvalidRoomId
