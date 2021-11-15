'use strict'

// Cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
var product_routes = require('./routes/product');
var user_routes = require('./routes/user');
var venta_routes = require('./routes/venta');
var cliente_routes = require('./routes/cliente');

// Middlewares 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijos a rutas / Cargar rutas
app.use('/api', product_routes);
app.use('/api', user_routes);
app.use('/api', venta_routes);
app.use('/api', cliente_routes);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
}

/* Exportar modulo (fichero actual) */
module.exports = app;