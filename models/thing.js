// Importation de mongoose
const mongoose = require('mongoose');

// fonction Schema mis a disposition par le package mongoose (Schema de données)
const thingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
});

// Export du module fini
module.exports = mongoose.model('thing', thingSchema);