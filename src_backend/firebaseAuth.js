const admin = require('firebase-admin')
const firebaseConfig = require('../firebase.config')
const app = admin.initializeApp(firebaseConfig)

module.exports = app.auth()
