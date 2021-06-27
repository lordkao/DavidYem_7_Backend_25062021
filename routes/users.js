const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/users')


/*création de compte*/
router.post('/signup',userCtrl.createUser)

/*Connexion*/
router.post('/login',(req,res,next) => {

})
module.exports = router