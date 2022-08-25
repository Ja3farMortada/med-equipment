module.exports = (server, db) => {


    server.get('/getSuppliers', (req, res) => {
        let query = `SELECT * FROM suppliers WHERE supplier_status = 1`;

        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results)
            }
        })
    });


    // Add Supplier
    server.post('/addSupplier', (req, res) => {
        let data = req.body;
        let query = `INSERT INTO suppliers SET ?`;
        db.query(query, data, function(error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                db.query(`SELECT * FROM suppliers WHERE supplier_ID = ${result.insertId}`, function(error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result[0]);
                    }
                });
            }
        });
    });

    // Edit Supplier
    server.post('/editSupplier', (req, res) => {
        let data = req.body;
        let query = `UPDATE suppliers SET ? WHERE supplier_ID = ${data.supplier_ID}`;
        db.query(query, data, function(error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    });

    // Delete Supplier
    server.post('/deleteSupplier', (req, res) => {
        let ID = req.body.ID;
        let query = `UPDATE suppliers SET supplier_status = 0 WHERE supplier_ID = ?`;
        db.query(query, ID, function(error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    })
}