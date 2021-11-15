'use strict'

var express = require('express');
var VentaController = require('../controllers/venta');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/user'});

// Rutas de prueba
router.post('/datos-venta', VentaController.datosVenta);
router.get('/test-de-controlador', VentaController.testVenta);

//Rutas Utiles
router.post('/save-venta', VentaController.saveVenta);
router.get('/ventas/:last?', VentaController.getVentas);
router.get('/venta/:id', VentaController.getVenta);
router.put('/venta/:id', VentaController.updateVenta);
router.delete('/venta/:id', VentaController.deleteVenta);
router.get('/search-venta/:search', VentaController.searchVenta);

module.exports = router;