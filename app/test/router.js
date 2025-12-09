const express = require("express")
const { test, test2 } = require("./controller")
const router = express.Router()

router.get("/", test)
router.get("/test", test2)

module.exports = router
