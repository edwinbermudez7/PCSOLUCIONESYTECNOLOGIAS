'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/user'});

// Rutas de prueba
router.post('/datos-usuario', UserController.datosUser);
router.get('/test-de-controlador', UserController.testUser);

//Rutas Utiles
router.post('/save-user', UserController.saveUser);
router.get('/users/:last?', UserController.getUsers);
router.get('/user/:id', UserController.getUser);
router.put('/user/:id', UserController.updateUser);
router.delete('/user/:id', UserController.deleteUser);
router.post('/upload-image-user/:id?', md_upload, UserController.uploadUser);
router.get('/get-image-user/:image', UserController.getImageUser);
router.get('/search-user/:search', UserController.searchUsers);

module.exports = router;