'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    documento: { type: Number, required: true, unique: true },
    nombreApellido: { type: String, required: true },
    telefono: { type: Number },
    correo: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
// Cliente --> guarda documentos de este tipo y con estructura dentro de la colección