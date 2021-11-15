'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var User = require('../models/user');

var controller = {

    datosUser: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            documento: 123,
            nombreApellido: 'Edwin Bermudez',
            telefono: 32145687,
            correo: 'Edwin@edwin.com',
            sucursal: 'cali',
            rol: 'admin',
            date: { type: Date, default: Date.now },
            image: 'hola'
        });
    },

    testUser: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de Userios'
        });
    },

    saveUser: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_documento = !validator.isEmpty(params.documento);
            var validate_nombreApellido = !validator.isEmpty(params.nombreApellido);
            var validate_telefono = !validator.isEmpty(params.telefono);
            var validate_correo = !validator.isEmpty(params.correo);
            var validate_sucursal = !validator.isEmpty(params.sucursal);
            var validate_rol = !validator.isEmpty(params.rol);
            


        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_documento && validate_nombreApellido) {

            //Crear el objeto a guardar
            var user = new User();

            // Asignar valores
            user.documento = params.documento;
            user.nombreApellido = params.nombreApellido;
            user.telefono = params.telefono;
            user.correo = params.correo;
            user.sucursal = params.sucursal;
            user.rol = params.rol;

            if (params.image) {
                user.image = params.image;
            } else {
                user.image = null;
            }

            // Guardar el userios
            user.save((err, userStored) => {

                if (err || !userStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El userios no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    user: userStored
                });

            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }

    },

    getUsers: (req, res) => {

        var query = User.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        // Find
        query.sort('-_id').exec((err, user) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los Usuario !!!'
                });
            }

            if (!user) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay Usuario para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });

        });
    },

    getUser: (req, res) => {

        // Recoger el id de la url
        var userid = req.params.id;

        // Comprobar que existe
        if (!userid || userid == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el Usuario !!!'
            });
        }

        // Buscar el userios
        User.findById(userid, (err, user) => {

            if (err || !userid) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el Usuario !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                user
            });

        });
    },

    updateUser: (req, res) => {
        // Recoger el id del userios por la url
        var userid = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try {
            var validate_documento = !validator.isEmpty(params.documento);
            var validate_nombreApellido = !validator.isEmpty(params.nombreApellido);
            var validate_telefono = !validator.isEmpty(params.telefono);
            var validate_correo = !validator.isEmpty(params.correo);
            var validate_sucursal = !validator.isEmpty(params.sucursal);
            var validate_rol = !validator.isEmpty(params.rol);
            
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_documento && validate_nombreApellido) {
            // Find and update
            User.findOneAndUpdate({ _id: userid }, params, { new: true }, (err, userUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if (!userUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el userios !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
        } else {
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta !!!'
            });
        }

    },

    deleteUser: (req, res) => {
        // Recoger el id de la url
        var userId = req.params.id;

        // Find and delete
        User.findOneAndDelete({ _id: userId }, (err, userRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if (!userRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el Usuario, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                user: userRemoved
            });

        });
    },

    uploadUser: (req, res) => {
        // Configurar el modulo connect multiparty router/user.js (hecho)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if (!req.files) {
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
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });

        } else {
            // Si todo es valido, sacando id de la url
            var userId = req.params.id;

            if (userId) {
                // Buscar el userios, asignarle el nombre de la imagen y actualizarlo
                User.findOneAndUpdate({ _id: userId }, { image: file_name }, { new: true }, (err, userUpdated) => {

                    if (err || !userUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de userios !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        user: userUpdated
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }

        }
    }, // end upload file

    getImageUser: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/user/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },

    searchUsers: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        User.find({ "$or": [
            { "nombreApellido": { "$regex": searchString, "$options": "i"}},
            { "correo": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, users) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }
            
            if(!users || users.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay producto que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            });

        });
    }

};  // end controller

module.exports = controller;