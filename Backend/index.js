'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3900;

//mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://admindb:lrjsp2COGePxA7Hs@cluster0.6ac63.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true })
        .then(() => {
            console.log('Conexión a la base de datos correcta !!!');

            // Crear servidor y ponerme a escuchar peticiones HTTP
            app.listen(port, () => {
                console.log('Servidor corriendo en http://localhost:'+port);
            });

        });