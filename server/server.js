require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Habilitando la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
//Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true });

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando en el puerto: ' + process.env.PORT);
});