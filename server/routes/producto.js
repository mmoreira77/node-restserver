const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//Obtener todos los productos
app.get('/productos', (req, res)=>{
    //Traer todos los productos
    //populate: usuario categoria
    //paginado
});

//Obtener un producto por ID
app.get('/productos/:id', (req, res)=>{
    //populate: usuario y categoria
    //paginado

});


//Crear producto
app.post('/productos', verificaToken, (req, res)=>{
    //grabar producto
    //grabar una categoria del listado
    let  body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
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
app.put('/productos/:id', (req, res)=>{
    //grabar producto
    //grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB)=>{
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

        productoDB.save((err, productoGuardado)=>{
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
app.delete('/productos/:id', (req, res)=>{
    

});



module.exports = app;
