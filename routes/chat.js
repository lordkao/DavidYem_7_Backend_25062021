const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const chatCtrl = require('../controllers/chat')

/*Création de message*/
router.post('/',auth ,chatCtrl.createMessageChat)

/*Suppression de message*/
router.delete('/:id',auth ,chatCtrl.deleteMessageChat)

/*Obtention de message*/
router.get('/',auth ,chatCtrl.getAllMessagesChat)

module.exports = router