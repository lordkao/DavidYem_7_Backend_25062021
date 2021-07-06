const database = require('../app.js')
const fs = require('fs')

/*logique métier pour les publications*/
exports.getAllPublications = (req,res,next) => {
    const db = database.connect()
    /*Obtention des 10 dernières publications*/
    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.id AS id,Publications.userId AS userId,Publications.message AS message,TIME(Publications.date) AS date,Publications.urlImage AS url FROM Users INNER JOIN publications ON Users.userId = Publications.userId ORDER BY Publications.date DESC LIMIT 10')
    .then((responses) => {
        return res.status(200).json(responses[0])
    })
    .catch((err) => {
        return res.status(500).json(err)
    })
    .then(() => db.end())
}
exports.getMorePublications = (req,res,next) => {
    const offset = req.params.numberOfPublications
    console.log(offset)
    const requete = `SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.message AS message,Publications.urlImage AS url,Publications.userId AS userId,DATE_FORMAT(Publications.date,GET_FORMAT(DATETIME,\'EUR\')) AS date,Publications.id AS id FROM Users INNER JOIN Publications ON Users.userId = Publications.userId ORDER BY Publications.date DESC LIMIT 10 OFFSET ${offset}`
    console.log(requete)
    const db = database.connect()
    /*Obtention des 10 publications plus anciennes*/
    db.promise().query(requete)
    .then((response) => {
        if(response[0].length == 0){
            console.log(response[0].length)
            res.status(404).json({ message : 'Il n\' y a plus d\'anciennes publications.'})
        }
        else{
            res.status(200).json(response[0])
        }
    })
    .catch((err) => res.status(500).json(err))
    .then(() => db.end())
}
exports.createPublication = (req,res,next) => {
    console.log(req.body)
    const userId = req.body.userId
    const message = req.body.message
    const date = new Date()
    const publication = req.file ? [userId,message,date,`${req.protocol}://${req.get('host')}/images/${req.file.filename}`] : [userId,message,date]
    /*Création d'une publication avec une condition s'il un fichier est joint*/ 
    if(req.file){
        const db = database.connect()
        db.promise().query('INSERT INTO publications(userId,message,date,urlImage) VALUES (?,?,?,?)',publication)
        .then(() => { res.status(201).json({ message : 'Publication créée avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())    
    }
    /*Sinon on créer la publication sans fichier*/
    else{
        const db = database.connect()
        db.promise().query('INSERT INTO publications(userId,message,date) VALUES (?,?,?)',publication)
        .then(() => { res.status(201).json({ message : 'Publication créée avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())
    }
}
exports.updatePublication = (req,res,next) => {/*ce middleware a été créer si jamais le client souhaite implémenter la possibilité de modifier une publication mais qui pourrait fausser l'intégrité des données*/
    console.log(req.body)
    const userId = req.body.userId
    const message = req.body.message
    const date = new Date()
    /*Condition pour déterminer la variable publication si un fichier est joint*/
    const publication = req.file ? [req.params.id,userId,message,date,`${req.protocol}://${req.get('host')}/images/${req.file.filename}`] : [req.params.id,userId,message,date]
    /*Si un fichier est joint*/
    if(req.file){
        const db = database.connect()
        db.promise().query('UPDATE publications(userId,message,date,urlImage) WHERE id=? VALUES (?,?,?,?)',publication)
        .then(() => { res.status(201).json({ message : 'Publication modifiée avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())    
    }
    /*Sinon on met à jour la publication*/
    else{
        const db = database.connect()
        db.promise().query('UPDATE publications(userId,message,date) WHERE id=? VALUES (?,?,?)',publication)
        .then(() => { res.status(201).json({ message : 'Publication modifiée avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())
    }
}
exports.deletePublication = (req,res,next) => {
    console.log(req.params.id)
    const id = [req.params.id]
    const db = database.connect()
        /*Requête de modification vers la Database*/
        /*************************************************/
        db.promise().query('SELECT urlImage FROM Publications WHERE Id=?',id)
        .then((response) => {
            console.log(response[0])
            const urlImage = response[0][0].urlImage
            console.log(urlImage)
            if(urlImage !== null){            
                const filename = urlImage.split('/images/')[1]
                fs.unlink(`images/${filename}`,() => {
                    db.promise().query('DELETE FROM publications WHERE id=? ',id)
                    .then((response) => {
                        console.log(response[0])
                        res.status(200).json({ message: 'Publication supprimée avec succès !'})
                    })
                    .catch((err) => {
                        return res.status(500).json(err)
                    })
                })
            }
            else{
                db.promise().query('DELETE FROM publications WHERE id=? ',id)
                    .then((response) => {
                        console.log(response[0])
                        res.status(200).json({ message: 'Publication supprimée avec succès !'})
                    })
                    .catch((err) => {
                        return res.status(500).json(err)
                    })
            }
        })
        .catch((err) => res.status(500).json(err))
}
/*Gestion des likes*/
exports.getLikes = (req,res,next) => {/*OK*/
    const id = req.params.id
    const db = database.connect()

    db.promise().query('select COUNT(publication) AS compteur FROM likes where publication = ?',[id])

    .then((responses) => {
        return res.status(200).json(responses[0][0])
    })
    .catch((err) => {
        return res.status(500).json(err)
    })
    .then(() => db.end())
}
exports.getDislikes = (req,res,next) => {/*OK*/
    const id = req.params.id
    const db = database.connect()

    db.promise().query('select COUNT(publication) AS compteur FROM dislikes where publication = ?',[id])

    .then((responses) => {
        return res.status(200).json(responses[0][0])
    })
    .catch((err) => {
        return res.status(500).json(err)
    })
    .then(() => db.end())
}
exports.postLike = (req,res,next) => {/*OK*/
    const like = req.body.like
    const userId = req.body.userId
    const id = req.params.id
    const db = database.connect()

    if(like == 1){/*Like*/
        console.log('like = 1')
        db.promise().query('INSERT INTO Likes(publication,userId) VALUES(?,?)',[id,userId])
        .then(() => res.status(200).json({message : 'Like mis à jour !'}))
        .catch((err) => res.status(500).json(err))
    }
    else{/*Neutre*/
        console.log('like = 0')
        db.promise().query('DELETE FROM Likes WHERE userId = ? AND publication = ?',[userId,id])
        .then(() => {res.status(200).json({ message : 'User neutre !'})})
        .catch((err) => res.status(500).json(err))
        }   
    } 
exports.postDislike = (req,res,next) => {/*OK*/
    const like = req.body.like
    const userId = req.body.userId
    const id = req.params.id
    const db = database.connect()

    if(like == -1){/*Dislike*/
        console.log('like = -1')
        db.promise().query('INSERT INTO Dislikes(publication,userId) VALUES(?,?)',[id,userId])
        .then(() => res.status(200).json({message : 'Dislike mis à jour !'}))
        .catch((err) => res.status(500).json(err))
    }
    else{/*Neutre*/
        console.log('like = 0')
        db.promise().query('DELETE FROM Dislikes WHERE userId = ? AND publication = ?',[userId,id])
        .then(() => { res.status(200).json({ message : 'User neutre !'})})
        .catch((err) => res.status(500).json(err))
    }   
} 
exports.getOneLike = (req,res,next) => {
    res.status(200).json({message:'requête reçue !'})
} 