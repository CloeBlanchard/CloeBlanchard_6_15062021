// Ajout d'express au projet
const express = require('express');
// Création du routeur
const router = express.Router();

// Import du model Thing
const Thing = require('../models/thing');

// Creation de la requete post
router.post('/', (req, res, next) => {
    // On enlève l'id (il sera généré automatiquement)
    delete req.body._id;
    // corps de la requete
    const thing = new Thing({
        ...req.body
    });
    // enregistrement de l'objet dans la base de donnée
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // Objet trouvé
        .catch(error => res.status(400).json({ error }));
});

// Requete DELETE suppression d'un objet
router.delete('/:id', (req, res, nexet) => {
    Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch(error => res.status(400).json({ error })) // Erreur serveur
});

// Regeute PUT modification d'un objet existant
router.put('/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.body })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error })); // Erreur serveur
});

// Requet GET récupération d'un objet spécifique
router.get('/:id', (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error })); //Objet non trouvé
})

// Requete GET récupération d'un tableau d'objet
router.get('/', (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json({ things }))
        .catch(error => res.status(400).json({ error })); // Erreur serveur
});

// Export du router
module.exports = router;