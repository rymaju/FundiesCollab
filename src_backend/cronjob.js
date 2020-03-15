const deleteRoom = require('./deleteRoom')

function cronjobSetup (roomData) {
  var CronJob = require('cron').CronJob
  var job = new CronJob(
    '0 0 0 * * *',
    function () {
      console.log('running cron job at ' + new Date().toISOString())
      var oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      for (let roomId in roomData) {
        if (roomData.hasOwnProperty(roomId) && roomData[roomId] !== undefined) {
          const date = roomData[roomId].lastActiveDateTime
          if (oneWeekAgo > date) {
            delete roomData[roomId]
            deleteRoom(roomId)
            console.log('deleted room ' + roomId)
          }
        }
      }
    },
    null,
    true,
    'America/Los_Angeles'
  )
  job.start()
}

module.exports = cronjobSetup
