const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

// empeche 2 utilisateurs d'avoir le meme mail grace a l'option "unique" et le mongoose validator
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
