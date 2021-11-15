'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var PORT  = process.env.PORT || 5000;


//mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;



mongoose.connect(process.env.MONGODB_URl || 'mongodb+srv://admindb:lrjsp2COGePxA7Hs@cluster0.6ac63.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true

})
    .then(() => {
        console.log('Conexión a la base de datos correcta !!!');

        // Crear servidor y ponerme a escuchar peticiones HTTP
        app.listen(PORT , () => {
            console.log('Servidor corriendo en http://localhost:' + PORT);
        });

    });
    

