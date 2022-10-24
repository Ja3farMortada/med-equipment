const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');


const db = require('./database');

server.use(express.urlencoded({
    extended: false
}));
server.use(express.json());


const homeRoutes = require('./routes/home.routes');
const villageRoutes = require('./routes/village.routes');
const suquimRoutes = require('./routes/suquim.routes');
const suppliersRoutes = require('./routes/suppliers.routes');
const reportsRoutes = require('./routes/reports.routes');

homeRoutes(server, db);
villageRoutes(server, db);
suquimRoutes(server, db);
suppliersRoutes(server, db);
reportsRoutes(server, db);

module.exports = server;