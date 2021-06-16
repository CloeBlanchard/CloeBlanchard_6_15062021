// Ajout d'express au projet
const express = require('express');

// Création du routeur
const router = express.Router();


// Import du controllers/stuf
const stuffCtrl = require('../controllers/stuff');

// Import de l'authentification
const auth = require('../middleware/auth');

// Import du middlewar de gestion de fichier
const multer = require('../middleware/multer-config');


// Creation de la requete post création d'un objet
router.post('/', auth, multer, stuffCtrl.createThing);

// Requete PUT modification d'un objet existant
router.put('/:id', auth, multer, stuffCtrl.modifyThing);

// Requete DELETE suppression d'un objet
router.delete('/:id', auth, stuffCtrl.deleteThing);

// Requet GET récupération d'un objet spécifique
router.get('/:id', auth, stuffCtrl.getOneThing);

// Requete GET récupération d'un tableau d'objet
router.get('/', auth, stuffCtrl.getAllThing);


// Export du router
module.exports = router;