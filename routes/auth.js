const express = require('express')
const router = express.Router()

// importing login & register from controller auth
const { login, register } = require('../controllers/auth')


router.post('/register', register)
router.post('./login', login)

module.exports = router