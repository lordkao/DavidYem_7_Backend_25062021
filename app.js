const express = require('express')
const app = express()
const usersRoutes = require('./routes/users')
const chatRoutes = require('./routes/chat')
const publicationRoutes = require('./routes/publications')
const path = require('path')
const mysql = require('mysql2')
require('dotenv').config()
const host = process.env.HOST
const user = process.env.USER
const password = process.env.PASSWORD
const database = process.env.DATABASE
/*Création de la fonction de connection*/
/*************************************************/
exports.connect = function(){
    const connection = mysql.createConnection({
    host : host,
    user : user,
    password : password,
    database : database
    })  
    return connection
}
/*Paramétrage du CORS*/
/*************************************************/
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','Origin,X-requested-With,Content,Accept,Content-Type,Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH,OPTIONS')
    next()
})
/*Paramétrage de l'analyseur de corps*/
/*************************************************/
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
/*Paramétrage des routes*/
/*************************************************/
/*Authentification du user*/
app.use('/api/auth',usersRoutes)
/*chat*/
app.use('/api/chat',chatRoutes)
/*publications*/
app.use('/api/publications',publicationRoutes)
/*Images*/
app.use('/images',express.static(path.join(__dirname,'images')))
module.exports = app
