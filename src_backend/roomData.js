const Redis = require('ioredis')

// Represents the persistent dictionary of room ids to their code
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
   * @returns {Promise<string>} a promise resolving in the code at the given room
   */
  get (roomId) {
    console.log(this.redis)
    console.log(this.lifespan)

    return new Promise((resolve, reject) => {
      this.redis
        .get(roomId)
        .then(code => {
          this.redis.expire(roomId, this.lifespan)
          resolve(code)
        })
        .catch(err => {
          console.error(err)
          reject(new Error('Internal redis store error:' + err))
        })
    })
  }

  /**
   * Sets the code at the given room id to the given code and resets expiration
   * @param {string} roomId the room id
   * @param {string} code the new code
   * @returns {Promise<string>} a promise resolving in the 'OK' response when the operation completes
   * */
  set (roomId, code) {
    return new Promise((resolve, reject) => {
      this.redis
        .set(roomId, code)
        .then(success => {
          this.redis.expire(roomId, this.lifespan)
          resolve(success)
        })
        .catch(err => {
          console.error(err)
          reject(new Error('Internal redis store error:' + err))
        })
    })
  }

  /**
   * Gets the size the of the roomData hashMap
   * @returns {Promise<number>} a promise resolving in the size of roomData
   * */
  size () {
    return new Promise((resolve, reject) => {
      this.redis
        .hlen(this.name)
        .then(count => resolve(count))
        .catch(err => {
          console.error(err)
          throw new Error('Internal redis store error:' + err)
        })
    })
  }

  /**
   * Gets the size the of the roomData hashMap
   * @returns {Promise<boolean>} a promise resolving in whether the total number of rooms exceeds capacity
   * */
  isFull () {
    return new Promise((resolve, reject) => {
      this.size()
        .then(count => resolve(count > this.capacity))
        .catch(err => {
          console.error(err)
          throw new Error('Internal redis store error:' + err)
        })
    })
  }
}

const roomData = new RoomData(new Redis(), 60 * 60 * 24 * 7)

module.exports = roomData
