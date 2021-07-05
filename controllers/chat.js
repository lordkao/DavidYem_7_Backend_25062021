const database = require('../app.js')

/*logique métier pour la gestion des messages*/
exports.getAllMessagesChat = (req,res,next) => {
    const db = database.connect()
    /*Obtention des messages du chat*/
    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Chat.id AS id,Chat.message AS message,DATE_FORMAT(Chat.date,GET_FORMAT(DATETIME,\'ISO\')) AS date,Chat.userId AS userId FROM Users INNER JOIN Chat ON Users.userId = Chat.userId ORDER BY date DESC LIMIT 10')
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
exports.getMoreMessages = (req,res,next) => {
    const numberOfMessages = [req.params.numberOfMessages]
    /*Obtention de plus de messages à afficher sur le front grâce à la variable numberOfMessages*/
    const string = `SELECT Users.nom AS nom,Users.prenom AS prenom,Chat.id AS id,Chat.userId AS userId,Chat.message AS message,DATE_FORMAT(Chat.date,GET_FORMAT(DATETIME,\'EUR\')) AS date FROM Users INNER JOIN Chat ON Users.userId = Chat.userId ORDER BY date DESC LIMIT 10 OFFSET ${numberOfMessages}`
    const db = database.connect()
    db.promise().query(string)
    .then((response) => {
        /*Si plus de messages plusanciens à afficher*/
        if(response[0].length == 0){
            console.log(response[0].length)
            res.status(404).json({ message : 'Il n\' y a plus d\'anciens messages.'})
        }
        /*Sinon on afficher les 10 prochains messages*/
        else{
            console.log(numberOfMessages)
            res.status(200).json(response[0])
        }
    })
    .catch((err) => res.status(500).json(err))
}
exports.createMessageChat = (req,res,next) => {
    const date = new Date()
    const message = req.body.message
    const userId = req.body.userId

    console.log(req.body)
    const db = database.connect()
    const infosMessage = [userId,message,date]
    /*Création d'un message chat*/
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
    const chat = [req.params.id]
    const db = database.connect()
    /*Suppression de message*/
    db.promise().query('DELETE FROM Chat WHERE id=? ',chat)
    .then(() => { res.status(200).json({ message : 'Message supprimé avec succès !'})})
    .catch((err) => { res.status(500).json({ err })})
    .then(() => db.end())
}