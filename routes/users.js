const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const userCtrl = require('../controllers/users')


/*création de compte*/
router.post('/signup',userCtrl.signup)

/*Connexion*/
router.post('/login',userCtrl.login)

/*Modification*/
router.put('/:userId',auth ,multer ,userCtrl.update)

/*Suppression*/
router.delete('/:userId',auth ,userCtrl.delete)

module.exports = router