const express = require('express')
const router = express.Router()
const publicationsCtrl = require('../controllers/publications')

router.get('/',publicationsCtrl.getAllPublications)

module.exports = router