const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//Cargando modelo de usuarios
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');  //paquete de file system
const path = require('path'); //Paquetes para rutas y poder llegar a la imganes

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    //Validar tipo
    let tipoValidos = ['productos', 'usuarios']
    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitiros son ' + tipoValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[1];
    console.log(extension);

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${extensionesValidas.join(', ')}`
            }
        })
    }

    //Cambiar nombre del archivo
    let nombreArchi = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchi}`, function (err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aqui, actualizar imagen. Porque esta cargada
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchi, tipo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchi, tipo);
                break;            
        }
        // res.json({
        //     ok: true,
        //     message: 'Imagen subida con exito'
        // });
    });
});

let imagenUsuario = (id, res, nombreArchivo, tipo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            //Borando imagen subida porque no hubo algun error
            borraArchivo(nombreArchivo, tipo); //Borrando nombre del archivo que acobo de subir, pero dio algun error de busqueda y por eso se borra
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Sucedio algún problema con la busquedad del usuario'
                }
            })
        }
        if (!usuarioDB) {
            //Borando imagen subida porque no se encontro el usuario, la imagen se sube en un proceso anterior
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID de usuario no encontrado'
                }
            })
        }
        //Borando imagen anterior
        borraArchivo(usuarioDB.img, tipo);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}

let imagenProducto = (id, res, nombreArchivo, tipo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            //Borando imagen subida porque no hubo algun error
            borraArchivo(nombreArchivo, tipo); //Borrando nombre del archivo que acobo de subir, pero dio algun error de busqueda y por eso se borra
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Sucedio algún problema con la busquedad del producto'
                }
            })
        }
        if (!productoDB) {
            //Borando imagen subida porque no se encontro el producto, la imagen se sube en un proceso anterior
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID de producto no encontrado'
                }
            })
        }
        //Borando imagen anterior
        borraArchivo(productoDB.img, tipo);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    });
}

let borraArchivo = (nombreImagen, tipo) => {
    //Tomando la ruta fisica de la imagen utilizando componente path
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //Confirmar si existe la imagen utiizando compenente FS
    if (fs.existsSync(pathImagen)) {
        //Borrar archivo
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;