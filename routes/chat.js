const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const chatCtrl = require('../controllers/chat')

router.post('/',auth ,chatCtrl.createMessageChat)

router.delete('/:id',auth ,chatCtrl.deleteMessageChat)

router.get('/',auth ,chatCtrl.getAllMessagesChat)

module.exports = router