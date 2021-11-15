'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VentaSchema = Schema({
    fechaVenta: { type: Date, default: Date.now },
    producto: { type: String, required: true },
    cliente: { type: String, required: true },
    vendedor:  { type: String, required: true },
    cantidad:  { type: Number, required: true },
    precio: { type: Number, required: true },
    total: { type: Number, required: true },
    sucursal:  { type: String, required: true },
});

module.exports = mongoose.model('Venta', VentaSchema);
// articles --> guarda documentos de este tipo y con estructura dentro de la colecció