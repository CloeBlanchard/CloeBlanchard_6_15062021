// Package de cryptage (bcrypt)
const bcrypt = require('bcrypt');
// package du token d'authenfication
const jwt = require('jsonwebtoken');
// Package du maskage de l'e-mail
const MaskData = require('maskdata');

// configuration des routes d'authentification
const User = require('../models/user');

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Masquage de l'email
    const emailMask2Options = {
        maskWith: "*",
        unmaskedStartCharactersBeforeAt: 30,
        unmaskedEndCharactersAfterAt: 20,
        maskAtTheRate: false,
    };
    const email = req.body.email;
    const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);
    // Hachage du password
    bcrypt.hash(req.body.password, 10) // 10 tout de l'algorythme de hachage (solt)
        .then(hash => {
            // nouvel user
            const user = new User({
                maskedEmail,
                password: hash
            });
            // Methode save pour l'enregistrer dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créer !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Connection d'utilisateur existant
exports.login = (req, res, next) => {
    // Trouve un user dans la base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Compare le mdp envoyer dansl a requete et le mdp dans la base de donnée
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrecte !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        // Fonction de jsonwebtoken
                        token: jwt.sign(
                            { userId: user._id }, 'RANDOM_TOKEN_SECRET',
                            // expiration du token
                            { expiresIn: '24h' }
                        )
                    })
                });
        })
        .catch(error => res.status(500).json({ error }));
};