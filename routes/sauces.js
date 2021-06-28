// Ajout d'express au projet
const express = require('express');
// Création du routeur
const router = express.Router();

// Import du controllers/sauces
const saucesCtrl = require('../controllers/sauces');
// Import de l'authentification
const auth = require('../middleware/auth');
// Import du middlewar de gestion de fichier
const multer = require('../middleware/multer-config');


// Creation de la requete post création d'un objet
router.post('/', auth, multer, saucesCtrl.createSauce);
// Requete PUT modification d'un objet existant
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// Requete DELETE suppression d'un objet
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// Requet GET récupération d'un objet spécifique
router.get('/:id', auth, saucesCtrl.getOneSauce);
// Requete GET récupération d'un tableau d'objet
router.get('/', auth, saucesCtrl.getAllSauces);
// Requete POST du like
router.post('/:id/like', auth, saucesCtrl.voteSauce);


// Export du router
module.exports = router;