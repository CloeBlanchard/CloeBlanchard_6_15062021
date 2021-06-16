// Ajout d'express au projet
const express = require('express');

// Création du routeur
const router = express.Router();


// Import du controllers/stuf
const stuffCtrl = require('../controllers/stuff');


// Creation de la requete post création d'un objet
router.post('/', stuffCtrl.createThing);

// Requete PUT modification d'un objet existant
router.put('/:id', stuffCtrl.modifyThing);

// Requete DELETE suppression d'un objet
router.delete('/:id', stuffCtrl.deleteThing);

// Requet GET récupération d'un objet spécifique
router.get('/:id', stuffCtrl.getOneThing);

// Requete GET récupération d'un tableau d'objet
router.get('/', stuffCtrl.getAllThing);


// Export du router
module.exports = router;