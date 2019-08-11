const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authSchema = mongoose.Schema({
    email: { type: String, require: true, unique:true},
    password: { type: String, require: true},
});
authSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', authSchema);