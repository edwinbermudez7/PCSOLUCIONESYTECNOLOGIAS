'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Venta = require('../models/venta');

var controller = {

    datosVenta: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            producto: 'Didema',
            cliente: 'Juan',
            vendedor:  'Pedro',
            cantidad:  2,
            precio: 15000,
            total: 30000,
            sucursal:  'Cali',
        });
    },

    testVenta: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de Ventas'
        });
    },

    saveVenta: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_producto = !validator.isEmpty(params.producto);
            var validate_cliente = !validator.isEmpty(params.cliente);
            var validate_vendedor = !validator.isEmpty(params.vendedor);
            var validate_cantidad = !validator.isEmpty(params.cantidad);
            var validate_precio = !validator.isEmpty(params.precio);
            var validate_total = !validator.isEmpty(params.total);
            var validate_sucursal = !validator.isEmpty(params.sucursal);
            

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_producto && validate_cliente && validate_vendedor && validate_cantidad && validate_precio && validate_total && validate_sucursal) {

            //Crear el objeto a guardar
            var venta = new Venta();

            // Asignar valores
            venta.producto = params.producto;
            venta.cliente = params.cliente;
            venta.vendedor = params.vendedor;
            venta.cantidad = params.cantidad;
            venta.precio = params.precio;
            venta.total = params.total;
            venta.sucursal = params.sucursal;

            // Guardar el venta
            venta.save((err, ventaStored) => {

                if (err || !ventaStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'La venta no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    venta: ventaStored
                });

            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }

    },

    getVentas: (req, res) => {

        var query = Venta.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        // Find
        query.sort('-_id').exec((err, venta) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los Ventas !!!'
                });
            }

            if(!venta){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay Ventas para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                venta
            });

        });
    },

    getVenta: (req, res) => {

        // Recoger el id de la url
        var ventaid = req.params.id;

        // Comprobar que existe
        if(!ventaid || ventaid == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el Venta !!!'
            });
        }

        // Buscar la VEnta
        Venta.findById(ventaid, (err, venta) => {
            
            if(err || !venta){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la Venta !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                venta
            });

        });
    },

    updateVenta: (req, res) => {
        // Recoger el id del Venta por la url
        var ventaId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try{
            var validate_producto = !validator.isEmpty(params.producto);
            var validate_cliente = !validator.isEmpty(params.cliente);
            var validate_vendedor = !validator.isEmpty(params.vendedor);
            var validate_cantidad = !validator.isEmpty(params.cantidad);
            var validate_precio = !validator.isEmpty(params.precio);
            var validate_total = !validator.isEmpty(params.total);
            var validate_sucursal = !validator.isEmpty(params.sucursal);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            }); 
        }

        if(validate_producto && validate_cliente && validate_vendedor && validate_cantidad && validate_precio && validate_total && validate_sucursal){
             // Find and update
             Venta.findOneAndUpdate({_id: ventaId}, params, {new:true}, (err, ventaUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if(!ventaUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe la VEnta !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    venta: ventaUpdated
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

    deleteVenta: (req, res) => {
        // Recoger el id de la url
        var ventaId = req.params.id;

        // Find and delete
        Venta.findOneAndDelete({_id: ventaId}, (err, ventaRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if(!ventaRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado la VEnta, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                venta: ventaRemoved
            });

        }); 
    },

    searchVenta: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Venta.find({ "$or": [
            { "producto": { "$regex": searchString, "$options": "i"}},
            { "vendedor": { "$regex": searchString, "$options": "i"}},
            { "cliente": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, venta) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }
            
            if(!venta || venta.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay Ventas que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                venta
            });

        });
    }

};  // end controller

module.exports = controller;