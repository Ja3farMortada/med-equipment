const e = require("express");

module.exports = (server, db) => {

    server.post('/search', (req, res) => {
        let data = req.body[0];
        let ppmData = req.body[1];
        let query = `SELECT e.*, s.name AS supplier FROM equipments e INNER JOIN suppliers s ON supplier_ID_FK = supplier_ID WHERE `;
        let values = [];
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].value) {
                if (count > 0) {
                    query += ` AND `;
                }
                count++;
                query += `${data[i].column} LIKE ?`;
                values.push(`%${data[i].value}%`);
            }
        }
        if (count > 0) {
            query += ` AND `;
        }
        switch (ppmData.value) {
            case 'all':
                query += `record_status = 1`;
                break;
            case 'due':
                query += `DATEDIFF(ppm_schedule, DATE(now())) < 30  AND DATEDIFF(ppm_schedule, DATE(now())) > 0 AND record_status = 1`;
                break;
            case 'over_due':
                query += `DATEDIFF(ppm_schedule, DATE(now())) < 0 AND record_status = 1`;
                break;
        }
        db.query(query, values, function(error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });

    });


    server.get('/getRecentEquipments', (req, res) => {
        let query = `SELECT e.*, s.name AS supplier FROM equipments e INNER JOIN suppliers s ON supplier_ID_FK = supplier_ID WHERE DATEDIFF(DATE(now()), date_added) < 10 AND record_status = 1`;
        db.query(query, function(error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    // Add Equipment
    server.post('/addEquipment', (req, res) => {
        let data = req.body;
        let query = `INSERT INTO equipments SET ?`;
        db.query(query, data, function(error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                db.query(`SELECT * FROM equipments WHERE record_ID = ${result.insertId}`, function(error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result[0]);
                    }
                });
            }
        });
    });

    // Edit Equipment
    server.post('/editEquipment', (req, res) => {
        let data = req.body;
        delete data['supplier']
        let query = `UPDATE equipments SET ? WHERE record_ID = ${data.record_ID}`;
        db.query(query, data, function(error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    });

    // Delete Equipment
    server.post('/deleteEquipment', (req, res) => {
        let ID = req.body.ID;
        let query = `DELETE FROM equipments WHERE record_ID = ?`;
        db.query(query, ID, function(error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    });

    // get service records
    server.get('/getService', (req, res) => {
        let ID = req.query.ID;
        let query = `SELECT * FROM service_history WHERE equipment_ID_FK = ?`;
        function doQuery() {
            db.query(query, ID, function (error, results) {
                if (error) {
                    if (error.code == 'ER_NO_SUCH_TABLE') {
                        let query2 = 'CREATE TABLE `med-equipments`.`service_history` (`service_ID` INT NOT NULL AUTO_INCREMENT , `equipment_ID_FK` INT NOT NULL , `service_description` VARCHAR(100) NOT NULL , `service_date` DATE NOT NULL , `service_time` TIME NOT NULL , `service_status` INT NOT NULL , PRIMARY KEY (`service_ID`)) ENGINE = InnoDB;';
                        db.query(query2)
                    } else {
                        res.status(400).send(error);
                    }
                    doQuery();
                } else {
                    res.send(results);
                }
            });
        }
        doQuery();
    });
}