const express = require('express')
const router = express.Router()

const mysql = require('mysql2')

function dbConnect(){
    const connection = mysql.createConnection({
    host : 'localhost',
    user : 'groupomania',
    password : 'client',
    database : 'groupomania'
    })  
    return connection
}

router.get('/',(req,res,next) =>{
    const db = dbConnect()

    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.userId AS userId,Publications.message AS message,TIME(Publications.date) AS date FROM Users INNER JOIN publications ON Users.userId = Publications.userId ORDER BY Users.id')

    .then((responses) => {
        console.log(responses[0])
        res.status(200).json(responses[0])
    })
    .catch((err) => {
        res.status(500).json(err)
    })
})

module.exports = router