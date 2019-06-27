// PUERTO

process.env.PORT = process.env.PORT || 3000


//----------------------------------------------------
// ENTORNO
//----------------------------------------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//----------------------------------------------------
// BASES DE DATOS
//----------------------------------------------------

let urlDB;

if (process.env.NODE_ENV === 'dev') {
   urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://melvin:gplbxA1l36pytCgE@cluster0-p8nay.gcp.mongodb.net/cafe';
}

process.env.URLDB = urlDB;