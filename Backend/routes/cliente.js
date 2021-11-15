'use strict'

var express = require('express');
var ClienteController = require('../controllers/cliente');

var router = express.Router();



// Rutas de prueba
router.post('/datos-cliente', ClienteController.datosCliente);
router.get('/test-Cliente', ClienteController.testCliente);

//Rutas Utiles
router.post('/save-cliente', ClienteController.saveCliente);
router.get('/clientes/:last?', ClienteController.getClientes);
router.get('/cliente/:id', ClienteController.getClliente);
router.put('/cliente/:id', ClienteController.updateCliente);
router.delete('/cliente/:id', ClienteController.deleteCliente);
router.get('/search-cliente/:search', ClienteController.searchCliente);

module.exports = router;