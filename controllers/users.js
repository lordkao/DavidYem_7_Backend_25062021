const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const uniqid = require('uniqid')


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

exports.signup = (req,res,next) => {
    const nom = req.body.nom
    const prenom = req.body.prenom
    const email = req.body.email
    const password = req.body.password

    /*Création d'un userId unique en utilisant les milliseconde de la date du moment*/
    let date = new Date()
    let time = date.getTime()
    let uniqueUserId = uniqid(time)
    console.log('test : '+uniqueUserId)

    if(nom == '' || prenom == '' || email == '' || password == ''){
        res.status(400).json({ erreur : 'il manque des informations !'})
    }
    else{
        bcrypt.hash(password,10)
        .then(hash => {
            const user = {
                nom : nom,
                prenom : prenom,
                email : email,
                password : hash,
                userId : uniqueUserId
            }
            console.log(user)
            console.log('mdp hashé : ' +hash)

            const db = dbConnect()
            /*Requête d'insertion vers la Database*/
            db.query('INSERT INTO users (nom,prenom,email,password,userId) VALUES (?,?,?,?,?)',
            [user.nom,user.prenom,user.email,user.password,user.userId],
            function(err,data){
                if(err){
                    res.status(401).json(err)
                }
                else{
                    console.log(data)
                    res.status(201).json({ message : 'Utilisateur créé !!'})
                }
            })
        })
        .catch( err => res.status(500).json({ err }))

    }
}

exports.login = (req,res,next) => {

}
