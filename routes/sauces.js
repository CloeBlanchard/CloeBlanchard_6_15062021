// Ajout d'express au projet
const express = require('express');

// Création du routeur
const router = express.Router();


// Import du controllers/stuf
const saucesCtrl = require('../controllers/sauces');

// Import de l'authentification
const auth = require('../middleware/auth');

// Import du middlewar de gestion de fichier
const multer = require('../middleware/multer-config');


// Creation de la requete post création d'un objet
router.post('/', auth, multer, saucesCtrl.createThing);

// Requete PUT modification d'un objet existant
router.put('/:id', auth, multer, saucesCtrl.modifyThing);

// Requete DELETE suppression d'un objet
router.delete('/:id', auth, saucesCtrl.deleteThing);

// Requet GET récupération d'un objet spécifique
router.get('/:id', auth, saucesCtrl.getOneThing);

// Requete GET récupération d'un tableau d'objet
router.get('/', auth, saucesCtrl.getAllThing);


// Export du router
module.exports = router;