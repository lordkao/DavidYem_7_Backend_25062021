const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.TOKEN_LOGIN 
module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token,secretKey)
        const userId = decodedToken.userId
        if(req.body.userId && req.body.userId !== userId){
            throw 'Invalide user ID '
        }
        else{
            next()
        }
    }
    catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'})
    }
}