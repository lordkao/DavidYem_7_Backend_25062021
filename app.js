const express = require('express')
const app = express()
const mysql = require('mysql2')

/*************************************************/
/*Création de la fonction de connection*/
function dbConnect(){
    const connection = mysql.createConnection({
    host : 'localhost',
    user : 'groupomania',
    password : 'client',
    database : 'groupomania'
    })  
    return connection
}

/*************************************************/
/*Paramétrage du CORS*/
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','Origin,X-requested-With,Content,Accept,Content-Type,Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH,OPTIONS')
    next()
})


/*************************************************/
/*Paramétrage de l'analyseur de corps*/
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())


/*************************************************/
/*Paramétrage des routes*/


/*************************************************/
/*POST*/
app.post('/users',(req,res,next) =>{
    console.log(req.body)
    res.status(200).json({ message:'Compte utilisateur créer !'})
})

app.get('/chat',(req,res,next) => {
    const db = dbConnect()

    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Chat.message AS message,DATE_FORMAT(Chat.date,GET_FORMAT(DATETIME,\'ISO\')) AS date FROM Users INNER JOIN Chat ON Users.userId = Chat.userId ORDER BY Users.id')

    .then((responses,fields) => {
        console.log(responses[0])
        const resultats = responses[0]
        res.status(200).json(resultats)
    })
    .catch((err) => {
        res.status(500).json(err)
    })
})

app.get('/publications',(req,res,next) =>{
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

module.exports = app

/*app.use('/chat',(req,res,next) => {
    connection.query(
        'SELECT Users.nom AS nom,Users.prenom AS prenom,Chat.message AS message,DATE_FORMAT(Chat.date,GET_FORMAT(DATETIME,\'ISO\')) AS date FROM Users INNER JOIN Chat ON Users.userId = Chat.userId ORDER BY Users.id',
        function(err,results,fields){
            let data = []
            if(err){
                throw(err)
            }
            for(let result of results){
                let objet = {
                    nom:result.nom,
                    prenom:result.prenom,
                    date:result.date,
                    message:result.message
                }
                data.push(objet)
            }
            console.log(data)
            res.status(200).json(data)
        }
    )
})*/