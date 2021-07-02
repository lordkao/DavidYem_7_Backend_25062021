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

    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Chat.id AS id,Chat.message AS message,DATE_FORMAT(Chat.date,GET_FORMAT(DATETIME,\'ISO\')) AS date FROM Users INNER JOIN Chat ON Users.userId = Chat.userId ORDER BY date DESC LIMIT 10')

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
exports.createMessageChat = (req,res,next) => {
    const date = new Date()
    const message = req.body.message
    const userId = req.body.userId

    console.log(req.body)
    const db = dbConnect()
    const infosMessage = [userId,message,date]
    db.promise().query('INSERT INTO chat(userId,message,date) VALUES(?,?,?)',infosMessage)
    .then((response) => {
        console.log(response[0])
        res.status(201).json({ message:'Message créé avec succès !'})
    })
    .catch((err) => {
        return res.status(500).json(err)
     })
     .then(() => db.end())
}
exports.deleteMessageChat = (req,res,next) => {
    console.log(req.params.id)
    const publication = [req.params.id]
    const db = dbConnect()
    db.promise().query('DELETE FROM Chat WHERE id=? ',publication)
    .then(() => { res.status(200).json({ message : 'Message supprimé avec succès !'})})
    .catch((err) => { res.status(500).json({ err })})
    .then(() => db.end())
}