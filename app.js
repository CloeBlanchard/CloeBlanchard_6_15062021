// Ajout d'express au projet
const express = require('express');

// Import de body-parser
const bodyParser = require('body-parser');

// Importation de mongoose
const mongoose = require('mongoose');

// Import de path qui donne acces du ssysteme de fichier
const path = require('path');


// Import du router
const saucesRoutes = require('./routes/sauces');

// Import des user/routes
const userRoutes = require('./routes/user');


// Contient l'application
const app = express();


// Lier mongoDB Atlas à mon api
mongoose.connect('mongodb+srv://cloe:Hy7VzxSrMHebbCsF@projet6.yqwxt.mongodb.net/projet6?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')
  );


// Gestion erreur cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Tranformer le corps de la requête en objet utilisable
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// middlawre des saucesroutes
app.use('/api/sauces', saucesRoutes);

// middleware des userRoutes
app.use('/api/auth', userRoutes);


// Exporter l'application
module.exports = app;