'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Product = require('../models/product');

var controller = {

    datosProducto: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            title: "Teclado USB",
            description: "Logitec 820",
            price: 25000,
            date: "3/11/2021",
            image: "Img",
            stop: 5,
            disponible: true,
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de productos'
        });
    },

    saveProduct: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_description = !validator.isEmpty(params.description);
            var validate_price = !validator.isEmpty(params.price);
            var validate_stop = !validator.isEmpty(params.stop);
            

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_title && validate_description) {

            //Crear el objeto a guardar
            var product = new Product();

            // Asignar valores
            product.title = params.title;
            product.description = params.description;
            product.price = params.price;
            product.stop = params.stop;
            product.disponible = true;

            if (params.image) {
                product.image = params.image;
            } else {
                product.image = null;
            }

            // Guardar el producto
            product.save((err, productStored) => {

                if (err || !productStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El producto no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    product: productStored
                });

            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }

    },

    getProducts: (req, res) => {

        var query = Product.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        // Find
        query.sort('-_id').exec((err, product) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los Productos !!!'
                });
            }

            if(!product){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay Productos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                product
            });

        });
    },

    getProduct: (req, res) => {

        // Recoger el id de la url
        var productid = req.params.id;

        // Comprobar que existe
        if(!productid || productid == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el producto !!!'
            });
        }

        // Buscar el producto
        Product.findById(productid, (err, product) => {
            
            if(err || !product){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el producto !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                product
            });

        });
    },

    updateProduct: (req, res) => {
        // Recoger el id del producto por la url
        var productId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_description = !validator.isEmpty(params.description);
            var validate_price = !validator.isEmpty(params.price);
            var validate_stop = !validator.isEmpty(params.stop);
           
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            }); 
        }

        if(validate_title && validate_description){
             // Find and update
             Product.findOneAndUpdate({_id: productId}, params, {new:true}, (err, productUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if(!productUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el producto !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    product: productUpdated
                });
             });
        }else{
             // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta !!!'
            });
        }
       
    },

    deleteProduct: (req, res) => {
        // Recoger el id de la url
        var productId = req.params.id;

        // Find and delete
        Product.findOneAndDelete({_id: productId}, (err, productRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if(!productRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el producto, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                product: productRemoved
            });

        }); 
    },

    uploadProduct: (req, res) => {
        // Configurar el modulo connect multiparty router/product.js (hecho)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si no es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });
        
        }else{
             // Si todo es valido, sacando id de la url
             var productId = req.params.id;

             if(productId){
                // Buscar el producto, asignarle el nombre de la imagen y actualizarlo
                Product.findOneAndUpdate({_id: productId}, {image: file_name}, {new:true}, (err, productUpdated) => {

                    if(err || !productUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de producto !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        product: productUpdated
                    });
                });
             }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
             }
            
        }   
    }, // end upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/product/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },

    searchProducts: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Product.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "description": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, products) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }
            
            if(!products || products.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay producto que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                products
            });

        });
    }

};  // end controller

module.exports = controller;