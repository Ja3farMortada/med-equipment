const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');

const homeRoutes = require('./routes/home.routes');

// require sqlite
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

// include db file
let dbFile;
if (fs.existsSync(path.join(__dirname, '../equipments.db'))) {
    dbFile = '../equipments.db';
} else {
    dbFile = '../../equipments.db';
}

sqlite.open({
    filename: path.join(__dirname, dbFile),
    driver: sqlite3.Database
}).then(db => {
    homeRoutes(server, db)
});

server.use(express.urlencoded({
    extended: false
}));
server.use(express.json());

module.exports = server;