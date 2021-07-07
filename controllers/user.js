// Package de cryptage (bcrypt)
const bcrypt = require('bcrypt');
// package du token d'authenfication
const jwt = require('jsonwebtoken');
// Package dy cryptage de l'email
const cryptoJs = require('crypto-js');

var key = cryptoJs.enc.Hex.parse(process.env.key);
var iv = cryptoJs.enc.Hex.parse(process.env.iv);

// configuration des routes d'authentification
const User = require('../models/user');

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Hachage du password
    bcrypt.hash(req.body.password, 10) // 10 tour de l'algorythme de hachage (salt)
        .then(hash => {
            // nouvel user
            const user = new User({
                // Masquage de l'email
                email: cryptoJs.AES.encrypt(req.body.email, key, { iv: iv }).toString(),
                password: hash
            });
            // Methode save pour l'enregistrer dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créer !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Connexion d'utilisateur existant
exports.login = (req, res, next) => {
    // Trouve un user dans la base de données
    User.findOne({ email: cryptoJs.AES.encrypt(req.body.email, key, { iv: iv }).toString() })
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