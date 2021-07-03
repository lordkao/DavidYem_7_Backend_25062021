const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const chatCtrl = require('../controllers/chat')
/*Création de message*/
router.post('/',auth ,chatCtrl.createMessageChat)
/*Suppression de message*/
router.delete('/:id',auth ,chatCtrl.deleteMessageChat)
/*Obtention de tous les message*/
router.get('/',auth ,chatCtrl.getAllMessagesChat)
/*Obtenir plus de messages*/
router.get('/:numberOfMessages',auth , chatCtrl.getMoreMessages)
module.exports = router