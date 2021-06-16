// Ajout d'express pour les router
const express = require('express');

// Import du router express
const router = express.Router();

// Import du user control
const userCtrl = require('../controllers/user');


// Import des routes post pour l'authentification
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Export du router
module.exports = router;