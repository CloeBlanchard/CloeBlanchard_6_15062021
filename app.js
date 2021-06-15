// Ajout d'express au projet
const express = require('express');
// Import de body-parser
const bodyParser = require('body-parser');
// Importation de mongoose
const mongoose = require('mongoose');

// Contient l'application
const app = express();

// Lier mongoDB Atlas à mon api
mongoose.connect('mongodb+srv://cloe:Hy7VzxSrMHebbCsF@projet6.yqwxt.mongodb.net/projet6?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Gestion erreur cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Tranformer le corps de la requête en objet utilisable
app.use(bodyParser.json());

// Creation de la requete post
app.post('/api/stuff',(req, res, next) => {
    // corps de la requete exploitable avec body-parser
    console.log(req.body);
    res.status(201).json({
        message: 'Objet créé !'
    });
});

// requete get read
app.use('/api/stuff', (req, res, next) => {
    const stuff = [
      {
        _id: 'oeihfzeoi',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 4900,
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeomoihi',
        title: 'Mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 2900,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
  });

// Exporter l'application
module.exports = app;