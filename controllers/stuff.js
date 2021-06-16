// Importation du schema thing
const Thing = require('../models/thing');

// Export de la fonction createThing et logique métier pour la route post
exports.createThing = (req, res, next) => {
    // envoyer un fichier avec la requete
    const thingObject = JSON.parse(req.body.thing);
    // On enlève l'id (il sera généré automatiquement)
    delete thingObject._id;
    // corps de la requete
    const thing = new Thing({
        ...thingObject,
        // modification de l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : {...req.body};
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.body })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Export de la fonction deleteThing et logique métier pour la supression d'un objet
exports.deleteThing = (req, res, nexet) => {
    Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch(error => res.status(400).json({ error }))
};

// Export de la fonction getOneThing et logique métier pour la creation d'un objet spécifique
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error })); //Objet non trouvé
};

// Export de la fonction getAllThings et logique métier pour la creation de tableau d'objet
exports.getAllThing = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json({ things }))
        .catch(error => res.status(400).json({ error }));
};