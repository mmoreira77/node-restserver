const express = require('express');
const fs = require('fs');
const path = require('path');
const {verificaTokenImg} = require('../middlewares/autenticacion')

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;

    //Tomando la ruta fisica de la imagen utilizando componente path
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    }else{
        let noImagenPath = path.resolve(__dirname, '../assets/404.png');
        res.sendFile(noImagenPath); //Recononce automticamente que tipo de archivo es
    }

});

module.exports = app;
