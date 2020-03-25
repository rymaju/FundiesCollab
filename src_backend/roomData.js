const Redis = require('ioredis')

/**  Represents the persistent cache of room ids to their code */
class RoomData {
  /**
   * Represents the persistent dictionary of room ids to their code
   * @param {Redis} redis the redis connection object
   * @param {number} capacity the maximum number of rooms allowed
   * @param {number} lifespan the time until a room expires, reset on every operation, in seconds
   * @returns {RoomData} the new RoomData connection
   */
  constructor (redis, lifespan) {
    this.redis = redis
    this.lifespan = lifespan
  }

  /**
   * Gets the code at the given room id and resets expiration
   * @param {string} roomId the room id
   * @returns {(Promise<string>)|(Promise<undefined>)} a promise resolving in the code at the given room
   */
  async get (roomId) {
    try {
      const code = await this.redis.get(roomId)

      if (code === null) {
        return undefined
      } else {
        this.redis.expire(roomId, this.lifespan)
        return code
      }
    } catch (error) {
      throw new Error('Internal redis store error:' + error)
    }
  }

  /**
   * Sets the code at the given room id to the given code and resets expiration
   * @param {string} roomId the room id
   * @param {string} code the new code
   * @returns {Promise<void>} a promise resolving in the 'OK' response when the operation completes
   * */
  async set (roomId, code) {
    try {
      this.redis.set(roomId, code)
      this.redis.expire(roomId, this.lifespan)
    } catch (error) {
      console.error(error)
      throw new Error('Internal redis store error:' + error)
    }
  }
}

const roomData = new RoomData(new Redis(), 60 * 60 * 24 * 7)

module.exports = roomData
