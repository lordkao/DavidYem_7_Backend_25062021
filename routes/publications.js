const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const publicationsCtrl = require('../controllers/publications')
const multer = require('../middleware/multer-config')

router.post('/',multer ,publicationsCtrl.createPublications)

router.get('/',auth ,publicationsCtrl.getAllPublications)

module.exports = router