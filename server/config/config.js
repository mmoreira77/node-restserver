// PUERTO

process.env.PORT = process.env.PORT || 3000


//----------------------------------------------------
// ENTORNO
//----------------------------------------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//----------------------------------------------------
// Vencimiento de token
//----------------------------------------------------

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//----------------------------------------------------
// SEED de autenticación
//----------------------------------------------------

process.env.SEED = process.env.SEED ||  'este-es-el-seed-desarrollo'

//----------------------------------------------------
// BASES DE DATOS
//----------------------------------------------------

let urlDB;

//----------------------------------------------------
// GOOGLE ID_CLIENT
//----------------------------------------------------

process.env.CLIENT_ID = process.env.CLIENT_ID || '807834628114-pq7b6hviqvkrlmlmosc6gcgi3qe97a91.apps.googleusercontent.com';

if (process.env.NODE_ENV === 'dev') {
   urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;