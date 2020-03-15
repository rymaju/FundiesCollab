const { exec } = require('child_process')

// deletes the folder cooresponding to the given room ID
// EFFECT: deletes the folder
// compileAndRun : String -> void
function deleteRoom (roomId) {
  exec('rm -r room-' + roomId)
}

module.exports = deleteRoom
