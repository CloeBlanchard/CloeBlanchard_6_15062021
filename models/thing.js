// Importation de mongoose
const mongoose = require('mongoose');

// fonction Schema mis a disposition par le package mongoose (Schema de données)
const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});

// Export du module fini
module.exports = mongoose.model('Thing', thingSchema);