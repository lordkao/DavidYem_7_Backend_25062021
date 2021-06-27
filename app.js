const express = require('express')
const app = express()
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'groupomania',
    password : 'client',
    database : 'groupomania'
})


/*Paramétrage du CORS*/
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','Origin,X-requested-With,Content,Accept,Content-Type,Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH,OPTIONS')
    next()
})
/*Paramétrage de l'analyseur de corps*/
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

/*Paramétrage des routes*/

/*POST*/
app.post('/users',(req,res,next) =>{
    console.log(req.body)
    res.status(200).json({ message:'Compte utilisateur créer !'})
})

app.use('/chat',(req,res,next) => {
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
})

app.use('/publications',(req,res,next) => {
    connection.query(
        'SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.userId AS userId,Publications.message AS message,TIME(Publications.date) AS date FROM Users INNER JOIN publications ON Users.userId = Publications.userId ORDER BY Users.id',
        function(err,responses){
            let data = []
            if(err){
                throw(err)
            }
            console.log(responses)
            for(let response of responses){
                let publication = {
                    nom:response.nom,
                    prenom:response.prenom,
                    date:response.date,
                    userId:response.userId,
                    message:response.message
                }
                data.push(publication)
            }
            console.log(data)
            res.status(200).json(data)
        }
    )
})

module.exports = app