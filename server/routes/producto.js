const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//Obtener todos los productos
app.get('/productos', (req, res) => {
    //Traer todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 0;
    hasta = Number(hasta);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });
});

//Obtener un producto por ID
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario y categoria
    //paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Algun problema con la ejecicón o ID incorrecto'
                    }
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })

});

//Buscando producto
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regEx = new RegExp(termino, 'i');

    Producto.find({ nombre: regEx })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error en el proceso de busqueda'
                    }
                })
            }

            res.json({
                ok: true,
                productos
            });
        });
    ;
});

//Crear producto
app.post('/productos', verificaToken, (req, res) => {
    //grabar producto
    //grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })

});

//Actualizar un producto
app.put('/productos/:id', (req, res) => {
    //grabar producto
    //grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        productoDB.nombre = body.nombre
        productoDB.precioUni = body.precio
        productoDB.categoria = body.categoria
        productoDB.disponible = body.disponible
        productoDB.descripcion = body.descripcion

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });
    });
});


//Eliminar producto
app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .exec((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }

            productoBorrado.disponible = false;

            productoBorrado.save((err, productoDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Ocurrio un error en la actualización'
                        }
                    })
                }

                res.json({
                    ok: true,
                    producto: productoDB,
                    message: 'Producto borrado'
                })
            });
        })

});



module.exports = app;
