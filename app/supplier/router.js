const express = require('express')
const { register, notRegisteredSupplier, registeredSupplier, detailSupplier } = require('./controller')
const router = express.Router()

router.post('/register', register)
router.get('/not-registered', notRegisteredSupplier)
router.get('/registered', registeredSupplier)
router.get('/detail/:ethWalletAddress', detailSupplier)

module.exports = router