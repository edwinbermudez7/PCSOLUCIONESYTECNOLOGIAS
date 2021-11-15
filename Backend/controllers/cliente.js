'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Cliente = require('../models/cliente');

var controller = {

    datosCliente: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            documento: 123,
            nombreApellido: 'Edwin Bermudez',
            telefono: 32145687,
            correo: 'Edwin@edwin.com'
        });
    },

    testCliente: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de Clientes'
        });
    },

    saveCliente: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_documento = !validator.isEmpty(params.documento);
            var validate_nombreApellido = !validator.isEmpty(params.nombreApellido);
            var validate_telefono = !validator.isEmpty(params.telefono);
            var validate_correo = !validator.isEmpty(params.correo);


        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_documento && validate_nombreApellido) {

            //Crear el objeto a guardar
            var cliente = new Cliente();

            // Asignar valores
            cliente.documento = params.documento;
            cliente.nombreApellido = params.nombreApellido;
            cliente.telefono = params.telefono;
            cliente.correo = params.correo;
            


            // Guardar el cliente
            cliente.save((err, clienteStored) => {

                if (err || !clienteStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El cliente no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    cliente: clienteStored
                });

            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }

    },

    getClientes: (req, res) => {

        var query = Cliente.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        // Find
        query.sort('-_id').exec((err, cliente) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los clientes !!!'
                });
            }

            if (!cliente) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay Usuario para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                cliente
            });

        });
    },

    getClliente: (req, res) => {

        // Recoger el id de la url
        var clienteid = req.params.id;

        // Comprobar que existe
        if (!clienteid || clienteid == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el Usuario !!!'
            });
        }

        // Buscar el Clientes
        Cliente.findById(clienteid, (err, cliente) => {

            if (err || !clienteid) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el Usuario !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                cliente
            });

        });
    },

    updateCliente: (req, res) => {
        // Recoger el id del Clientes por la url
        var clienteid = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try {
            var validate_documento = !validator.isEmpty(params.documento);
            var validate_nombreApellido = !validator.isEmpty(params.nombreApellido);
            var validate_telefono = !validator.isEmpty(params.telefono);
            var validate_correo = !validator.isEmpty(params.correo);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_documento && validate_nombreApellido) {
            // Find and update
            Cliente.findOneAndUpdate({ _id: clienteid }, params, { new: true }, (err, clienteUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if (!clienteUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el Clientes !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    cliente: clienteUpdated
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

    deleteCliente: (req, res) => {
        // Recoger el id de la url
        var clienteId = req.params.id;

        // Find and delete
        Cliente.findOneAndDelete({ _id: clienteId }, (err, clienteRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if (!clienteRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el Usuario, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                cliente: clienteRemoved
            });

        });
    },

   

   

    searchCliente: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Cliente.find({
            "$or": [
                { "nombreApellido": { "$regex": searchString, "$options": "i" } },
                { "correo": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, cliente) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición !!!'
                    });
                }

                if (!cliente || cliente.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay producto que coincidan con tu busqueda !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    cliente
                });

            });
    }

};  // end controller

module.exports = controller;