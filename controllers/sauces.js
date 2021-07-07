// Importation du schema thing
const Sauce = require('../models/sauces');
// Import de file system
const fs = require('fs');

// Export de la fonction createThing et logique métier pour la methode post
exports.createSauce = (req, res, next) => {
    // envoyer un fichier avec la requete
    const sauceObject = JSON.parse(req.body.sauce);
    // On enlève l'id (il sera généré automatiquement)
    delete sauceObject._id;
    // corps de la requete
    const sauce = new Sauce({
        ...sauceObject,
        // modification de l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // modification de likes
        likes: 0,
        // modification de dislikes
        dislikes: 0,
        // modification de usersLiked
        usersLiked: [],
        // modification de udersDisliked
        usersDisliked: [],
    });
    // enregistrement de l'objet dans la base de donnée
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // Objet trouvé
        .catch(error => res.status(400).json({ error }));
};

// Export de la fonction modifyThing et logique métier pour la mise à jour d'un objet existant
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
        : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Export de la fonction deleteThing et logique métier pour la supression d'un objet
exports.deleteSauce = (req, res, nexet) => {
    // Récupération de l'objet
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Récupération du nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            // Pour supprimer un fichier
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Export de la fonction getOneThing et logique métier pour la récupération d'un objet spécifique
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error })); //Objet non trouvé
};

// Export de la fonction getAllThings et logique métier pour la récupération de tableau d'objet
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Système de like et dislike
// Exports de la fonction likeDislikeSauce
exports.voteSauce = (req, res, next) => {
    // Evalue une expression et celon la response obtiens le cas associé
    switch (req.body.like) {
        // Si le cas correspond à 0
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    // Système de dislike si le user est déjà dans le tableau de usersLike
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        // User est dans le tableau alors on update la sauce avec _id de la requete
                        Sauce.updateOne({ _id: req.params.id }, {
                            // Décrémentation de 1 des valeurs de Dislike (-1)
                            $inc: { dislikes: -1 },
                            // Le user est retiré du tableau
                            $pull: { usersDisliked: req.body.userId }
                        })
                            .then(() => res.status(201).json({ message: 'Votre avis a bien été enregistré !' }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    // Système de like si user est déjà dans le tableau de usersLike
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        // User est dans le tableau alors on update la sauce avec _id de la requete
                        Sauce.updateOne({ _id: req.params.id }, {
                            // Décrémentation de 1 des valeurs de Like (-1)
                            $inc: { likes: -1 },
                            // Le user est retiré du tableau
                            $pull: { usersLiked: req.body.userId }
                        })
                            .then(() => res.status(201).json({ message: 'Votre avis a bien été enregistré !' }))
                            .catch((error) => res.status(400).json({ error }));
                    }

                })
                .catch((error) => res.status(404).json({ error }));
            // On rompt la boucle
            break;
        // Système de like si user n'est pas dans le tableau 
        // Si le cas correspond a 1
        case 1:
            // Recherche ed la sauce correspondant à _id
            Sauce.updateOne({ _id: req.params.id }, {
                // Incrémentation de 1 des valeurs de Like (+1)
                $inc: { likes: 1 },
                // Ajout de le user dans le tableau 'usersLiked'
                $push: { usersLiked: req.body.userId }
            })
                .then(() => res.status(200).json({ message: 'Votre avis a bien été enregistré !' }))
                .catch((error) => res.status(400).json({ error }));
            // On rompt la boucle
            break;
        // Système de dislike si user n'est pas dans le tableau 
        // Si le cas correspond a -1
        case -1:
            // Recherche ed la sauce correspondant à _id
            Sauce.updateOne({ _id: req.params.id }, {
                // Incrémentation de 1 des valeurs de Like (+1)
                $inc: { dislikes: 1 },
                // Ajout de le user dans le tableau 'usersLiked'
                $push: { usersDisliked: req.body.userId }
            })
                .then(() => res.status(200).json({ message: 'Votre avis a bien été enregistré !' }))
                .catch((error) => res.status(400).json({ error }));
            // On rompt la boucle
            break;
        // Erreur par defaut
        default:
            console.error('Bad request');
    }
};