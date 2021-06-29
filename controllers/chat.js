const mysql = require('mysql2')

/*Création de la fonction de connection*/
/*************************************************/

function dbConnect(){
    const connection = mysql.createConnection({
    host : 'localhost',
    user : 'groupomania',
    password : 'client',
    database : 'groupomania'
    })  
    return connection
}

exports.getAllMessagesChat = (req,res,next) => {
    const db = dbConnect()

    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Chat.message AS message,DATE_FORMAT(Chat.date,GET_FORMAT(DATETIME,\'ISO\')) AS date FROM Users INNER JOIN Chat ON Users.userId = Chat.userId ORDER BY date DESC')

    .then((responses,fields) => {
        /*console.log(responses[0])*/
        const resultats = responses[0]
        return res.status(200).json(resultats)
    })
    .catch((err) => {
       return res.status(500).json(err)
    })
    .then(() => db.end())
}
exports.createMessageChat = (req,res,next) =>{
    const date = new Date()
    const message = req.body.message
    const userId = req.body.userId

    console.log(req.body)
    const db = dbConnect()
    const infosMessage = [userId,message,date]
    db.promise().query('INSERT INTO chat(userId,message,date) VALUES(?,?,?)',infosMessage)
    .then((response) => {
        console.log(response[0])
        res.status(201).json({ message:'confirmation de création !'})
    })
    .catch((err) => {
        return res.status(500).json(err)
     })
     .then(() => db.end())
}