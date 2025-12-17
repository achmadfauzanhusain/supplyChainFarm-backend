const { initializeApp } = require("firebase/app")
const { getFirestore, collection } = require("firebase/firestore")

const { firebaseKey, firebaseAuthDomain, firebaseMessaginSenderId, firebaseAppId } = require("../config")

const firebaseConfig = {
    apiKey: firebaseKey,
    authDomain: firebaseAuthDomain,
    projectId: "dsupplychain-130806",
    storageBucket: "dsupplychain-130806.firebasestorage.app",
    messagingSenderId: firebaseMessaginSenderId,
    appId: firebaseAppId,
    measurementId: "G-K8EWBDH1Q9"
}

initializeApp(firebaseConfig);

const db = getFirestore()
const colSupplier = collection(db, "suppliers")

module.exports = { db, colSupplier }