const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
                .sort('descripcion')
                .populate('usuario', 'nombre email')
                .exec((err, categorias)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    res.json({
                        ok: true,
                        categorias
                    });
                });

});

//Mostrar categorias por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
    
});

//Crear categoria
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//Actualiza categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.use
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//Delete
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
});



module.exports = app;
