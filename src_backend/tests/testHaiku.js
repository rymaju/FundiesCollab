const Haikunator = require('haikunator')
const haikunator = new Haikunator()

function generateRoomId () {
  return haikunator.haikunate({ tokenLength: 4 })
}

let count = 0
let pastIds = {}
let haiku = generateRoomId()
while (pastIds[haiku] === undefined) {
  pastIds[haiku] = true
  haiku = generateRoomId()
  count += 1
  if (count % 10 === 0) console.log(count)
}
console.log(`${count} unique room ids before a collision with the id ${haiku}`)
