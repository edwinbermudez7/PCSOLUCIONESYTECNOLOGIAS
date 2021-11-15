'use strict'

var express = require('express');
var ProductController = require('../controllers/product');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/product'});

// Rutas de prueba
router.post('/datos-producto', ProductController.datosProducto);
router.get('/test-de-controlador', ProductController.test);

//Rutas Utiles
router.post('/save-produc', ProductController.saveProduct);
router.get('/products/:last?', ProductController.getProducts);
router.get('/product/:id', ProductController.getProduct);
router.put('/product/:id', ProductController.updateProduct);
router.delete('/product/:id', ProductController.deleteProduct);
router.post('/upload-image/:id?', md_upload, ProductController.uploadProduct);
router.get('/get-image/:image', ProductController.getImage);
router.get('/search/:search', ProductController.searchProducts);

module.exports = router;