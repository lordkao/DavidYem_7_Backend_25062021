const database = require('../app.js')

/*logique métier pour la gestion des messages*/
exports.getAllMessagesChat = (req,res,next) => {
    const db = database.connect()
    /*Obtention des messages du chat*/
    db.promise().query('SET lc_time_names = \'fr_FR\'')
    .then(() => {
        db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Chat.id AS id,Chat.message AS message,DATE_FORMAT(Chat.date,\'le %W %e %M à %H:%i\') AS date,Chat.userId AS userId FROM Users INNER JOIN Chat ON Users.userId = Chat.userId ORDER BY Chat.date DESC LIMIT 10')
    .then((responses,fields) => {
        /*console.log(responses[0])*/
        const resultats = responses[0]
        return res.status(200).json(resultats)
    })
    .catch((err) => {
       return res.status(500).json(err)
    })
    .then(() => db.end())
    })
    .catch((err) => res.status(500).json(err))
}
exports.getMoreMessages = (req,res,next) => {/*Regex ok*/
    const numberOfMessages = [req.params.numberOfMessages]
    /*Obtention de plus de messages à afficher sur le front grâce à la variable numberOfMessages*/
    const string = `SELECT Users.nom AS nom,Users.prenom AS prenom,Chat.id AS id,Chat.userId AS userId,Chat.message AS message,DATE_FORMAT(Chat.date,\'le %W %e %M à %H:%i\') AS date FROM Users INNER JOIN Chat ON Users.userId = Chat.userId ORDER BY date DESC LIMIT 10 OFFSET ${numberOfMessages}`
    const db = database.connect()
    if((/[\D]/.test(numberOfMessages))){/*Vérification de la valeur de offset*/
        res.status(400).json({ message :'offset invalide'})
    }
    else{
        db.promise().query('SET lc_time_names = \'fr_FR\'')
        .then(() => {
            db.promise().query(string)
            .then((response) => {
                if(response[0].length == 0){ /*Si plus de messages plus anciens à afficher*/
                    console.log(response[0].length)
                    res.status(404).json({ message : 'Il n\' y a plus d\'anciens messages.'})
                }
                else{/*Sinon on afficher les 10 prochains messages*/
                    console.log(numberOfMessages)
                    res.status(200).json(response[0])
                }
            })
            .catch((err) => res.status(500).json(err))
            .then(() => db.end())   
        })
        .catch((err) => res.status(500).json(err))
    }
}
exports.createMessageChat = (req,res,next) => {/*Regex ok*/
    const date = new Date()
    const message = req.body.message
    const userId = req.body.userId
    console.log(req.body)
    const db = database.connect()
    const infosMessage = [userId,message,date]
    if((/[=*<>&|]/.test(message))){/*Vérification de la valeur de message */
        res.status(400).json({ message :'Ces caractères spéciaux sont interdits pour des raisons de sécurité(=*<>&|)'})
    }
    else if((/([^a-zA-Z0-9@]+)/.test(userId))){/*Vérification de la valeur de userId*/
        res.status(400).json({ message :'format du UserId invalide'})
    }
    else{
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
    
}
exports.deleteMessageChat = (req,res,next) => {/*Regex ok*/
    console.log(req.params.id)
    const id = [req.params.id]
    if((/[\D]/.test(id))){/*Vérification de la valeur de Id*/
        res.status(400).json({ message :'Id invalide'})
    }
    else{
        const db = database.connect()
        /*Suppression de message*/
        db.promise().query('DELETE FROM Chat WHERE id=? ',id)
        .then(() => { res.status(200).json({ message : 'Message supprimé avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())
    }
}