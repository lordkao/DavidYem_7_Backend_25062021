# DavidYem_7_backend_25062021
Bonjour et bienvenue dans ce projet qui est la réalisation de la partie Backend pour le projet Groupomania.
Le but étant de créer une API permettant de gérer une base de données SQL.

Pour commencer,assurez-vous d'avoir installer sur votre machine Node.js.Si vous ne l'avez pas, pas de panique voici un lien pour le télécharger:
/****************************************************************************/
(https://nodejs.org/en/download/releases/)<== lien Node.js

npm devrait s'installer automatiquement lorsque vous télécharger Node.js.(cela vous permettra de gérer vos dépendences).

-Cloner ce repository sur votre machine.

-Exécuter la commande 'npm init' afin d'initialiser un fichier package.json.
Celui-ci vous permettra d'enregistrer toutes les dépendences que vous aurez installer pour ce projet.

-maintenant,installer les dépendences  nécessaire pour lancer le projet,en effectuant la commande 'npm install'.
Cela devrait installer plusieurs modules:

-Bcrypt qui servira à crypter les mots de passes avec lesquelles l'application devra travailler.

-Crypto-js qui nous permettra içi de cacher les données personnelles des l'utilisateurs.

-Dotenv qui nous permettra de stocker des clés ou autres donnée à masquer.
Dans votre dossier racine du projet sur votre machine,il vous faudra créer un fichier '.env'.
Celui-ci va nous permettre de gérer nos variables d'environnement qui contiendront les données sensibles.

faites un copier/coller dans .env de ceci:
(Remplacez les valeurs entre ' ' par vos propres informations)
/****************************************************************************/
HOST='localhost par default en local'

USER='nom de l'utilisateur avec lequel vous vous connecter'

PASSWORD='votre mot de passe'

DATABASE='nom de votre database'

TOKEN_LOGIN='chaîne de caractère aléatoire'

KEY_CRYPTOJS='000102030405060708090a0b0c0d0e0f'<====exeption pour la clé,il vous faut 32 caractères(je vous laisse le choix de modifier celle_ci à votre guise)

IV_CRYPTOJS='101112131415161718191a1b1c1d1e1f'<====== exeption comme pour la KEY il faut aussi 32 caractères

!ATTENTION!
ADMIN='mQp/48cBYhBFVsQpwe0aqYhYK/tUwRkP9NUGNZDLrEE=' <===cette chaîne de caractère est le résultat du mail crypté de 'groupomania@hotmail.fr',
Remplacer par votre mail crypté (une fois crypté avec vos 'KEY' et 'IV' défini) avec lequel vous créer votre compte
afin de pouvoir obtenir la main sur tous les éléments postés coté Front.

!ATTENTION!
USERID_ADMIN='16255488235661am4i4dwskqrlsrnz'  <===cette chaîne correspond au userId de votre compte une fois créer,remplacez-la par le votre

!IMPORTANT! : une fois ces 2 variables configurées,aller sur la partie FRONTEND et remplacez les valeurs de la variable 'const userIdAdmin' présente dans la partie top des fichiers 'chat.js' et 'multimedia.js'. Une fois terminé,vous venez de créer un compte admin vous permettant de gérer le contenu sur les 2 forums chat et publications de l'application.


/*******compte pour le/la chargé de communication************/
Voici les informations par défaut du compte Admin que vous pouvez créer si vous ne touchez pas au code.

email=groupomania@hotmail.fr
email une fois crypté ===> mQp/48cBYhBFVsQpwe0aqYhYK/tUwRkP9NUGNZDLrEE=
password='mot de passe lors de la création'

/****************************************************************************/
Enfin reprenons la suite des modules qui seront installer suite à l'exécution de 'npm install':

-Express qui va nous permettre de créer notre API afin d'intéragir avec la base de données et le front.

-Jsonwebtoken afin d'envoyer un jeton d'authentification à la connexion ou création de compte.

-multer qui va venir traiter les fichiers entrants de l'application Frontend.

-Myslq2 nous permettra la gestion de la base de données à l'aide de promises qui viendront sécuriser nos requêtes.

-Nodemon qui est indispensable pour redémarrer automatiquement l'application à chaques modifications.

-Et enfin UniqId qui gérera la création des UsersIds.

Voilà,nous avons fait le tour des modules dont vous aurez besoin pour lancer l'application.Il ne vous reste plus qu'à démarrer le serveur avec 'npm start',
celui -ci devrait se lancer sur le port 3000 de votre machine. (http://localhost:3000)<==

Si vous êtes tomber ici par hasard,je vous invite à visiter la partie Frontend de cette application à l'adresse suivante:

(https://github.com/lordkao/DavidYem_7_Frontend_23062021.git)

Si vous êtes arriver là,alors il est temps de créer notre base de données avec mysql.
(Vous pouvez télécharger MYSQL à cette adresse: https://dev.mysql.com/downloads/mysql/#downloads)
Puis suivez les instructions indiquées,si vous n'y arrivez pas, suivez ce cours gratuit,il vous permettra d'utiliser MYSQL par la suite.

==>https://openclassrooms.com/fr/courses/1959476-administrez-vos-bases-de-donnees-avec-mysql/1959969-installez-mysql

Maintenant référrez vous au cours si vous rencontrer des difficultés car il nous faudra créer 5 tables dans notre base de données.


Connecter vous et copier-coller ce bout de code qui devrait vous permettre d'obtenir la même base de données que moi.

Pour créer les tables dont nous aurons besoins : 

-exécuter ces commandes :


/*****************/
CREATE TABLE test(
id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
nom VARCHAR(50) NOT NULL,
prenom VARCHAR(50) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
userId VARCHAR(50) NOT NULL UNIQUE,
urlImage VARCHAR(255)
)
ENGINE=INNODB;	
/**************/

-exécuter ces commandes :
/*****************/
CREATE TABLE users(
id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
nom VARCHAR(50) NOT NULL,
prenom VARCHAR(50) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
userId VARCHAR(50) NOT NULL UNIQUE,
urlImage VARCHAR(255)
)
ENGINE=INNODB;	
/**************/

CREATE TABLE chat(
id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
userId VARCHAR(50) NOT NULL,
message TEXT NOT NULL,
date DATETIME NOT NULL
)
ENGINE=INNODB;

/***********************/

CREATE TABLE publications(
id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
userId VARCHAR(50) NOT NULL,
message TEXT NOT NULL,
date DATETIME NOT NULL,
urlImage TEXT
)
ENGINE=INNODB;

/*************************/
déclaration de clés étrangères

ALTER TABLE publications
ADD CONSTRAINT fk_userId_test FOREIGN KEY(userId) REFERENCES users(userId) ON DELETE CASCADE;

ALTER TABLE publications
ADD INDEX ind_date_publication (date);

ALTER TABLE chat
ADD INDEX ind_date_chat (date);

ALTER TABLE chat
ADD CONSTRAINT fk_userId_chat FOREIGN KEY(userId) REFERENCES users(userId) ON DELETE CASCADE;

CREATE TABLE likes(
id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
publication INT UNSIGNED NOT NULL,
userId VARCHAR(50) NOT NULL
)
ENGINE=INNODB;
/*****************************************/
CREATE TABLE dislikes(
id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
publication INT UNSIGNED NOT NULL,
userId VARCHAR(50) NOT NULL
)
ENGINE=INNODB;
/***********************************************************/

ALTER TABLE likes
ADD CONSTRAINT fk_userId_likes FOREIGN KEY(userId) REFERENCES users(userId) ON DELETE CASCADE;


ALTER TABLE dislikes
ADD CONSTRAINT fk_userId_dislikes FOREIGN KEY(userId) REFERENCES users(userId) ON DELETE CASCADE;

ALTER TABLE likes
ADD CONSTRAINT fk_publicationId_likes FOREIGN KEY(publication) REFERENCES publications(id) ON DELETE CASCADE;

ALTER TABLE dislikes
ADD CONSTRAINT fk_publicationId_dislikes FOREIGN KEY(publication) REFERENCES publications(id) ON DELETE CASCADE;




