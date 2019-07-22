const jwt = require('jsonwebtoken');

//==========================================
//==== Verificar TOKEN
//==========================================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válildo'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
    // res.json({
    //     token: token
    // });
    // console.log(token);
    // next();
};



let verificaAdmin_Role = (req, res, next) => {
    
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    }else{
        return res.json({
            message: 'El usuario no es administrador'
        });
    }    
};
module.exports = {verificaToken, verificaAdmin_Role}