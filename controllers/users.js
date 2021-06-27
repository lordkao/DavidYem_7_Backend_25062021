const mysql = require('mysql2')

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

exports.createUser = (req,res,next) => {
    const nom = req.body.nom
    const prenom = req.body.prenom
    const email = req.body.email
    const password = req.body.password

    if(nom == '' || prenom == '' || email == '' || password == ''){
        res.status(400).json({ token :''})
    }
    else{
        

        res.status(201).json({ token : 'lordkao' })
    }
}