'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    image:{ type: String},
    stop: { type: Number, required: true },
    disponible: { type: Boolean, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);
// productos --> guarda documentos de este tipo y con estructura dentro de la colección