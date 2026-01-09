const express = require('express')
const { register, notRegisteredSupplier, registeredSupplier, detailSupplier, changeStatus, deleteSupplier, searchSupplier } = require('./controller')
const router = express.Router()

router.post('/register', register)
router.get('/not-registered', notRegisteredSupplier)
router.get('/registered', registeredSupplier)
router.get('/detail/:ethWalletAddress', detailSupplier)
router.patch('/change-status', changeStatus)
router.delete('/', deleteSupplier)
router.post("/search", searchSupplier)

module.exports = router