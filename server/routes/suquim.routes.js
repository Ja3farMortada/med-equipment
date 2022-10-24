const e = require("express");

module.exports = (server, db) => {

    server.post('/searchSuquim', (req, res) => {
        let data = req.body[0];
        let ppmData = req.body[1];
        let query = `SELECT e.*, s.name AS supplier FROM suquim_equipments e LEFT JOIN suppliers s ON supplier_ID_FK = supplier_ID WHERE `;
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
        db.query(query, values, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });

    });


    server.get('/getRecentEquipmentsSuquim', (req, res) => {
        let query = `SELECT e.*, s.name AS supplier FROM suquim_equipments e INNER JOIN suppliers s ON supplier_ID_FK = supplier_ID WHERE DATEDIFF(DATE(now()), date_added) < 10 AND record_status = 1`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    // Add Equipment
    server.post('/addEquipmentSuquim', (req, res) => {
        let data = req.body;
        let query = `INSERT INTO suquim_equipments SET ?`;
        db.query(query, data, function (error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                db.query(`SELECT * FROM suquim_equipments WHERE record_ID = ${result.insertId}`, function (error, result) {
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
    server.post('/editEquipmentSuquim', (req, res) => {
        let data = req.body;
        delete data['supplier']
        let query = `UPDATE suquim_equipments SET ? WHERE record_ID = ${data.record_ID}`;
        db.query(query, data, function (error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    });

    // Delete Equipment
    server.post('/deleteEquipmentSuquim', (req, res) => {
        let ID = req.body.ID;
        let query = `DELETE FROM suquim_equipments WHERE record_ID = ?`;
        db.query(query, ID, function (error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    });

    // get service records
    server.get('/getServiceSuquim', (req, res) => {
        let ID = req.query.ID;
        let query = `SELECT * FROM suquim_history WHERE equipment_ID_FK = ? AND service_status = 1`;

        function doQuery() {
            db.query(query, ID, function (error, results) {
                if (error) {
                    if (error.code == 'ER_NO_SUCH_TABLE') {
                        let query2 = 'CREATE TABLE `med-equipments`.`suquim_history` (`service_ID` INT NOT NULL AUTO_INCREMENT , `equipment_ID_FK` INT NOT NULL , `service_type` VARCHAR(10) NOT NULL , `service_description` VARCHAR(100) NOT NULL , `service_date` DATE NOT NULL , `service_time` TIME NOT NULL , `service_notes` VARCHAR(100) NULL, `service_status` BOOLEAN NOT NULL  DEFAULT 1, PRIMARY KEY (`service_ID`)) ENGINE = InnoDB;';
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


    // add new service
    server.post('/addNewServiceSuquim', (req, res) => {
        let data = req.body.data;
        let query = `INSERT INTO suquim_history SET ?`;
        db.query(query, data, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                if (data.service_type == 'ppm') {
                    let ID = data.equipment_ID_FK;
                    let date = data.service_date;
                    let query2 = `UPDATE suquim_equipments SET ppm_done = ? WHERE record_ID = ?; UPDATE equipments SET  ppm_schedule = DATE_ADD(ppm_schedule, INTERVAL 1 YEAR) WHERE record_ID = ?`;
                    db.query(query2, [date, ID, ID], function (error) {
                        if (error) {
                            res.status(400).send(error);
                        } else {
                            res.send('');
                        }
                    })
                } else {
                    res.send('');
                }
            }
        })
    })

    // delete service
    server.post('/deleteServiceSuquim', (req, res) => {
        let ID = req.body.ID;
        let query = `UPDATE suquim_history SET service_status = 0 WHERE service_ID = ?`;
        db.query(query, ID, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('')
            }
        })
    })

    // getExtensions
    server.get('/getExtensionsSuquim', (req, res) => {
        let ID = req.query.ID;
        let query = `SELECT * FROM suquim_extensions WHERE equipment_ID_FK = ? AND ext_status = 1`;

        function doQuery() {
            db.query(query, ID, function (error, results) {
                if (error) {
                    if (error.code == 'ER_NO_SUCH_TABLE') {
                        let query2 = 'CREATE TABLE `med-equipments`.`suquim_extensions` (`ext_ID` INT NOT NULL AUTO_INCREMENT , `equipment_ID_FK` INT NOT NULL , `ext_name` VARCHAR(50) NOT NULL , `ext_serial_no` VARCHAR(50) NULL ,  `ext_notes` VARCHAR(100) NULL, `ext_status` BOOLEAN NOT NULL  DEFAULT 1, PRIMARY KEY (`ext_ID`)) ENGINE = InnoDB;';
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

    // addExtension
    server.post('/addExtensionSuquim', (req, res) => {
        let data = req.body.data;
        let query = `INSERT INTO suquim_extensions SET ?`;
        db.query(query, data, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        })
    })

    // deleteExtension
    server.post('/deleteExtensionSuquim', (req, res) => {
        let ID = req.body.ID;
        let query = `UPDATE suquim_extensions SET ext_status = 0 WHERE ext_ID = ?`;
        db.query(query, ID, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('')
            }
        })
    })
}