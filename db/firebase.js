const admin = require("firebase-admin")
const serviceAccount = require("./dsupplychain.json")

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

const db = admin.firestore()
const colSupplier = db.collection("suppliers")

module.exports = { db, colSupplier }