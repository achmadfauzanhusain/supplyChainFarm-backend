const express = require('express')
const { register, notRegisteredSupplier } = require('./controller')
const router = express.Router()

router.post('/register', register)
router.get('/not-registered', notRegisteredSupplier)

module.exports = router