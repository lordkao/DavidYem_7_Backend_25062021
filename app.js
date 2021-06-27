const express = require('express')
const app = express()
const usersRoutes = require('./routes/users')
const chatRoutes = require('./routes/chat')
const publicationRoutes = require('./routes/publications')



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

/*users*/
app.use('/users',usersRoutes)

/*chat*/
app.use('/chat',chatRoutes)

/*publications*/
app.use('/publications',publicationRoutes)

module.exports = app
