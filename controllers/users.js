const bcrypt = require('bcrypt')
const uniqid = require('uniqid')
const jwt = require('jsonwebtoken')
const fs = require('fs')
require('dotenv').config()
const secretKey = process.env.TOKEN_LOGIN
const database = require('../app.js')
const cryptoJs = require('crypto-js')
const key = cryptoJs.enc.Hex.parse(process.env.KEY_CRYPTOJS)
const iv = cryptoJs.enc.Hex.parse(process.env.IV_CRYPTOJS)
const mailAdmin = process.env.ADMIN
const userIdAdmin = process.env.USERID_ADMIN
/*Fonction qui crypt le mail renseigné*/
function crypt(mail){
    const cryptMail = cryptoJs.AES.encrypt(mail,key,{ iv:iv }).toString()
    console.log(`mail crypté : ${cryptMail}`)
    return cryptMail
}

exports.signup = (req,res,next) => {
    const nom = req.body.nom
    const prenom = req.body.prenom
    const email = req.body.email
    const password = req.body.password
    const mailToSave = crypt(email)
    const Admin = mailAdmin
    /*fonction qui permet la création d'un userId unique en utilisant les milliseconde de la date du moment*/
    /*************************************************//*************************************************/
    function uniqueUserId(){
        let date = new Date()
        let time = date.getTime()
        let uniqueUserId = uniqid(time)
        console.log('test : '+uniqueUserId) 
        return uniqueUserId
    }
    if(nom == '' || prenom == '' || email == '' || password == ''){
        res.status(400).json({ erreur : 'il manque des informations !'})
    }
    else{
        /*Emploi de bcrypt pour hasher et saler le password*/
        /*************************************************/
        bcrypt.hash(password,10)
        .then((hash) => {
            const userId = uniqueUserId()
            const infosUser = [nom,prenom,mailToSave,hash,userId]
            /*console.log(infosUser)
            console.log('mdp hashé : ' +hash)*/
    
            const db = database.connect()
            /*Si le mail correspond au mail du e-communication*/
            if(crypt(email) === Admin){
                const data = [nom,prenom,mailToSave,hash,userIdAdmin]
                db.promise().query('INSERT INTO users (nom,prenom,email,password,userId) VALUES (?,?,?,?,?)',data)
                .then((response) => {
                    console.log(response[0])
                    return res.status(201).json({ 
                        userId:userIdAdmin,
                        token:jwt.sign(
                            { userId:userIdAdmin},
                            secretKey,
                            { expiresIn: '24h'}
                        )
                    })
                })
                .catch((err) => res.status(500).json({err}))
            }
            /*Sinon on créer un simple compte*/
            else{
                db.promise().query('INSERT INTO users (nom,prenom,email,password,userId) VALUES (?,?,?,?,?)',infosUser)
                .then((response) => {
                    console.log(response[0])
                    return res.status(201).json({ 
                        userId:userId,
                        token:jwt.sign(
                            { userId:userId},
                            secretKey,
                            { expiresIn: '24h'}
                        )
                    })
                })
                .catch((err) => res.status(500).json({err}))
            }
        })
        .catch((err) => res.status(500).json({err}))
    }
}       
exports.login = (req,res,next) => {
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    const db = database.connect()
    /*Sécurisation de l'email en le cryptant avc une key et un iv*/
    const mailToMatch = crypt(email)
    /*Test pour la récuperation de l'email*/
    const decryptedMail = cryptoJs.AES.decrypt(mailToMatch,key,{ iv:iv })
    const originalMail = decryptedMail.toString(cryptoJs.enc.Utf8)
    /*Console.log pour confirmer le décryptage du mal*/
    console.log(`mail d'origine: ${originalMail}`)
    const data = [mailToMatch]
    db.promise().query('SELECT * FROM Users WHERE email=?',data)
    .then((response) => {
        /*S'il n'y a pas de correspondance*/
        console.log(response[0])
        if(response[0].length == 0){
            return res.status(401).json({ erreur:' Utilisateur non trouvé !'})
        }
        else if(response.length > 0){
            const result = response[0]
            const userIdResult = result[0].userId
            const passwordResult = result[0].password
            console.log(`userId : ${userIdResult} et password : ${passwordResult}`)
            bcrypt.compare(password,passwordResult)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({ error: 'Mot de passe incorrect !'})
                }
                return res.status(200).json({ 
                    userId:userIdResult,
                    token:jwt.sign(
                        { userId:userIdResult},
                        secretKey,
                        { expiresIn: '24h'}
                    )
                })
            })
            .catch((err) => res.status(500).json(err))
        }
    })
    .catch( err => {return res.status(500).json(err)})
    .then(() => db.end())
}
exports.update = (req,res,next) => {
    const nom = req.body.nom
    const prenom = req.body.prenom
    const userId = req.params.userId
    const infosUser = req.file ? [nom,prenom,`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,userId]: [nom,prenom,userId]

    if(nom == '' || prenom == ''){
        res.status(400).json({ erreur : 'il manque des informations !'})
    }
    else if(req.file){
        const db = database.connect()
        /*Requête de modification vers la Database*/
        /*************************************************/
        db.promise().query('SELECT urlImage FROM users WHERE userId=?',[userId])
        .then((response) => {
            console.log(response[0])
            const urlImage = response[0][0].urlImage
            console.log(urlImage)
            /*Si urlImage n'est pas null on va utiliser fs pour supprimer l'image avant de la remplacer par la nouvelle*/
            if(urlImage !== null){            
                const filename = urlImage.split('/images/')[1]
                fs.unlink(`images/${filename}`,() => {
                    db.promise().query('UPDATE users SET nom = ?,prenom = ?,urlImage = ? WHERE userId = ?',infosUser)
                    .then((response) => {
                        console.log(response[0])
                        res.status(200).json({ message: 'Modifications effectuées avec succès !'})
                    })
                    .catch((err) => {
                        return res.status(500).json(err)
                    })
                    db.end()
                })
            }
            /*S'il n'y a pas d'image existante alors on met à jour directement*/
            else{
                db.promise().query('UPDATE users SET nom = ?,prenom = ?,urlImage = ? WHERE userId = ?',infosUser)
                    .then((response) => {
                        console.log(response[0])
                        res.status(200).json({ message: 'Modifications effectuées avec succès !'})
                    })
                    .catch((err) => {
                        return res.status(500).json(err)
                    })
                    db.end()
            }
        })
        .catch((err) => res.status(500).json(err))
    }
    else{
            const db = database.connect()
            /*Requête de modification vers la Database*/
            /*************************************************/
            db.promise().query('UPDATE users SET nom = ?,prenom = ? WHERE userId = ?',infosUser)
            .then((response) => {
                /*console.log(response[0])*/
                res.status(200).json({ message: 'Modifications effectuées avec succès !'})
            })
            .catch((err) => {
                return res.status(500).json(err)
             })
            db.end()
    }
}
exports.delete = (req,res,next) => {
    console.log(req.params.userId)
    const userId = [req.params.userId]
    const db = database.connect()
    /*On va vérifier si une image a été enregistrer sur ce compte utilisateur*/
    db.promise().query('SELECT urlImage FROM users WHERE userId=?',[userId])
    .then((response) => {
        console.log(response[0][0])
        const urlImage = response[0][0].urlImage
        console.log(urlImage)
        /*Si urlImage n'est pas null on va utiliser fs pour supprimer l'image avant de la remplacer par la nouvelle*/
        if(urlImage !== null){            
            const filename = urlImage.split('/images/')[1]
            fs.unlink(`images/${filename}`,() => {
                /*Suppression dans la base de données par rapport à userId*/
                db.promise().query('DELETE FROM users WHERE userId = ? ',userId)
                .then((response) => {
                    console.log({ message:'Utilisateur supprimé avec succès !'})
                    res.status(200).json({ message : 'compte utilisateur supprimé avec succès !'})
                })
                .catch((err) => {
                     return res.status(500).json({err})
                    })
                db.end()
            })
        }
        else{
            db.promise().query('DELETE FROM users WHERE userId = ? ',userId)
            .then((response) => {
                console.log({ message:'Utilisateur supprimé avec succès !'})
                res.status(200).json({ message : 'compte utilisateur supprimé avec succès !'})
            })
            .catch((err) => {
                    return res.status(500).json({err})
                })
            db.end()
        }
    }) 
}       
exports.getInfosProfil = (req,res,next) => {
    const userId = [req.params.userId]
    const db = database.connect()
    /*Obtention des informations utilisateur*/
    db.promise().query('SELECT * FROM users WHERE userId=?',userId)
    .then((results) => {
        const resultats = results[0][0]
        const dataToSend = {
            nom: resultats.nom,
            prenom: resultats.prenom,
            email: resultats.email,
            urlImage: resultats.urlImage
        }
        console.log(dataToSend)
        return res.status(200).json(dataToSend)
    })
    .catch((err) => res.status(500).json(err))
    .then(() => db.end())
}