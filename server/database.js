const mysql = require('mysql2');
const keys = require('../keys.json');

var pool = mysql.createPool({
    connectionLimit: 1,
    host: keys.host,
    user: keys.username,
    password: keys.password,
    database: keys.database,
    multipleStatements: true,
    dateStrings: 'date'
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }
    if (connection) connection.release();
    return;
});

module.exports = pool;