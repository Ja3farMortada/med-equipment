const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');

// require sqlite
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const db = require('./database');
// include db file
// let dbFile;
// if (fs.existsSync(path.join(__dirname, '../equipments.db'))) {
//     dbFile = '../equipments.db';
// } else {
//     dbFile = '../../equipments.db';
// }

// sqlite.open({
//     filename: path.join(__dirname, dbFile),
//     driver: sqlite3.Database
// }).then(db => {
//     homeRoutes(server, db)
// });

server.use(express.urlencoded({
    extended: false
}));
server.use(express.json());


const homeRoutes = require('./routes/home.routes');
const suppliersRoutes = require('./routes/suppliers.routes');

homeRoutes(server, db);
suppliersRoutes(server, db);

module.exports = server;