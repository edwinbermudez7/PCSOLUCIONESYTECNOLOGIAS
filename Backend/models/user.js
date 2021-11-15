'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    documento: { type: Number, required: true, unique: true },
    nombreApellido: { type: String, required: true },
    telefono: { type: Number },
    correo: { type: String, required: true },
    sucursal: { type: String, required: true },
    rol: { type: String, required: true },
    date: { type: Date, default: Date.now },
    image: { type: String}
});

module.exports = mongoose.model('User', UserSchema);
// Usurios --> guarda documentos de este tipo y con estructura dentro de la colección