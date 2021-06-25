const express = require('express')
const app = express()

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','Origin,X-requested-With,Content,Accept,Content-Type,Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH,OPTIONS')
    next()
})

app.use('/chat',(req,res,next) => {
    const message = [
        {
            _id:'300',
            auteur:'david',
            dateTime:'25/06/2021 16:25:00',
            message:'Hello fiston !!'
        },
        {
            _id:'200',
            auteur:'tyler',
            dateTime:'25/06/2021 17:56:00',
            message:'Hello papa !!'
        }
    ]
    res.status(200).json(message)
})
app.use('/publications',(req,res,next) => {
    const publications = [
        {
            auteur:'David',
            texte:'Bonjour les vacances !'
        },
        {
            auteur:'Tyler',
            texte:'Tu as trop de chance d\'être en vacances.'
        }
    ]
    res.status(200).json(publications)
})
app.use('/users',(req,res,next) => {
    const user = [
        {
            nom:'Lordkao',
            email:'test@hotmail.fr',
            userId:2021
        }
    ]
    res.status(200).json(user)
})

module.exports = app