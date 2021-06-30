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

exports.getAllPublications = (req,res,next) => {
    const db = dbConnect()

    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.userId AS userId,Publications.message AS message,TIME(Publications.date) AS date FROM Users INNER JOIN publications ON Users.userId = Publications.userId ORDER BY date DESC')

    .then((responses) => {
        return res.status(200).json(responses[0])
    })
    .catch((err) => {
        return res.status(500).json(err)
    })
    .then(() => db.end())
}
exports.createPublications = (req,res,next) => {
  res.status(200).json({ message:'requête POST reçue !'})
}
/*'INSERT INTO publications(userId,message,date,urlImage) VALUES (?,?,?,?)'*/