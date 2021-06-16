// Ajout d'express au projet
const express = require('express');
// Import de body-parser
const bodyParser = require('body-parser');
// Importation de mongoose
const mongoose = require('mongoose');

// Import du model Thing
const Thing = require('./models/thing');

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
  // On enlève l'id (il sera généré automatiquement)
  delete req.body._id;
    // corps de la requete
    const thing = new Thing({
      ...req.body
    });
    // enregistrement de l'objet dans la base de donnée
    thing.save()
    .then(() => res.status(201).json({message: 'Objet enregistré !'})) // Objet trouvé
    .catch(error => res.status(400).json({error}));
});

// Requete DELETE suppression d'un objet
app.delete('api/stuff/:id', (req, res, nexet) => {
  Thing.deleteOne({_id: req.params.id})
  .then(() => res.status(200).json({message: 'Objet supprimé !'}))
  .catch(error => res.status(400).json({error})) // Erreur serveur
})

// Regeute PUT modification d'un objet existant
app.put('/api/stuff/:id', (req, res, next) => { 
  Thing.updateOne({_id: req.params.id}, {...req.body, _id: req.params.body})
  .then(() => res.status(200).json({message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({error})); // Erreur serveur
});

// Requet GET récupération d'un objet spécifique
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({_id: req.params.id})
  .then(thing => res.status(200).json(thing))
  .catch(error => res.status(404).json({error})); //Objet non trouvé
})

// Requete GET récupération d'un tableau d'objet
app.get('/api/stuff', (req, res, next) => {
  Thing.find()
  .then(things => res.status(200).json({things}))
  .catch(error => res.status(400).json({error})); // Erreur serveur
});

// Exporter l'application
module.exports = app;