// Package de cryptage (bcrypt)
const bcrypt = require('bcrypt');

// configuration des routes d'authentification
const User = require('../models/user');


// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Hachage du password
    bcrypt.hash(req.body.password, 10) // 10 tout de l'algorythme de hachage (solt)
    .then(hash => {
        // nouvel user
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        // Methode save pour l'enregistrer dans la base de donnée
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créer !'}))
        .catch(error => res.status(400).json({ error}));
    })
    .catch(error => res.status(500).json({ error }));
};

// Connection d'utilisateur existant
exports.login = (req, res, next) => {
};