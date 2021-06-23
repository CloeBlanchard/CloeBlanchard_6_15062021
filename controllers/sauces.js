// Importation du schema thing
const Thing = require('../models/thing');

// Import de file system
const fs = require('fs');

// Export de la fonction createThing et logique métier pour la route post
exports.createThing = (req, res, next) => {
    // envoyer un fichier avec la requete
    const thingObject = JSON.parse(req.body.sauce);
    // On enlève l'id (il sera généré automatiquement)
    delete thingObject._id;
    // corps de la requete
    const thing = new Thing({
        ...thingObject,
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
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // Objet trouvé
        .catch(error => res.status(400).json({ error }));
};

// Export de la fonction modifyThing et logique métier pour la mise à jour d'un objet existant
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        } 
        : { ...req.body };
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Export de la fonction deleteThing et logique métier pour la supression d'un objet
exports.deleteThing = (req, res, nexet) => {
    // Récupération de l'objet
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            // Récupération du nom du fichier
            const filename = thing.imageUrl.split('/images/')[1];
            // Pour supprimer un fichier
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
    .catch(error => res.status(500).json({ error }));
};

// Export de la fonction getOneThing et logique métier pour la creation d'un objet spécifique
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json( thing ))
        .catch(error => res.status(404).json({ error })); //Objet non trouvé
};

// Export de la fonction getAllThings et logique métier pour la creation de tableau d'objet
exports.getAllThing = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json( things ))
        .catch(error => res.status(400).json({ error }));
};

// Système de like et dislike
// Exports de la fonction likeDislikeSauce
exports.voteThing = (req, res, next) => {
    // Evalue une expression et celon la response obtiens le cas associé
    switch (req.body.like) {
        // Si le cas correspond à 0
        case 0:
            Thing.findOne({ _id: req.params.id})
            .then((sauce) => { 
                // Système de like si user est déjà dans le tableau de usersLike
                if (sauce.usersLiked.find(user => user === req.body.userId)) {
                    // User est dans le tableau alors on update la sauce avec _id de la requete
                    Thing.updateOne({ _id: req.params.id }, {
                        // Décrémentation de 1 des valeurs de Like (-1)
                        $inc: { likes: -1},
                        // Le user est retiré du tableau
                        $pull: { usersLiked: req.body.userId }
                    })
                .then(() => res.status(201).json({ message: 'Votre avis a bien été enregistré !'}))
                .catch((error) => res.status(400).json({ error }));
                }
                // Système de dislike si le user est déjà dans le tableau de usersLike
                if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                    // User est dans le tableau alors on update la sauce avec _id de la requete
                    Thing.updateOne({ _id: req.params.id} , {
                        // Décrémentation de 1 des valeurs de Like (-1)
                        $inc: { dislikes: -1 },
                        // Le user est retiré du tableau
                        $pull: { usersDisliked : req.body.userId }
                    })
                    .then(() => res.status(201).json({ message: 'Votre avis a bien été enregistré !'}))
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
            Thing.updateOne({ _id: req.params.id}, {
                // Incrémentation de 1 des valeurs de Like (+1)
                $inc: { likes: 1},
                // Ajout de le user dans le tableau 'usersLiked'
                $push: { usersLiked: req.body.userId}
            })
            .then(() => res.status(200).json({ message: 'Votre avis a bien été enregistré !'}))
            .catch((error) => res.status(400).json({ error }));
            // On rompt la boucle
            break;
        // Système de dislike si user n'est pas dans le tableau 
        // Si le cas correspond a 1
        case 1:
            // Recherche ed la sauce correspondant à _id
            Thing.updateOne({ _id: req.params.id}, {
                // Incrémentation de 1 des valeurs de Like (+1)
                $inc: { dislikes: 1},
                // Ajout de le user dans le tableau 'usersLiked'
                $push: { usersDisliked: req.body.userId}
            })
            .then(() => res.status(200).json({ message: 'Votre avis a bien été enregistré !'}))
            .catch((error) => res.status(400).json({ error }));
            // On rompt la boucle
            break;
            // Erreur par defaut
        default:
            console.error('Bad request');
    }
};