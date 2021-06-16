// Importation de mongoose
const mongoose = require('mongoose');

// Importation du validateur unique
const uniqueValidator = require('mongoose-unique-validator');


// Creation user Schema
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});


// Application du plug-in du validateur unique
userSchema.plugin(uniqueValidator);


// Export du schema en model
module.exports = mongoose.model('user', userSchema);