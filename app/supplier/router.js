const express = require('express')
const { register, notRegisteredSupplier, registeredSupplier } = require('./controller')
const router = express.Router()

router.post('/register', register)
router.get('/not-registered', notRegisteredSupplier)
router.get('/registered', registeredSupplier)

module.exports = router