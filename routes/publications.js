const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const publicationsCtrl = require('../controllers/publications')

router.get('/',auth ,publicationsCtrl.getAllPublications)

module.exports = router