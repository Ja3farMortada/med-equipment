module.exports = (server, db) => {


    server.get('/getServiceReport', (req, res) => {
        let year = req.query.year;
        let queryText = `SELECT COUNT(*) AS count FROM service_history WHERE MONTH(service_date) = 1 AND YEAR(service_date) = ${year}`;
        for (i = 2; i <= 12; i++) {
            queryText += ` UNION ALL SELECT COUNT(*) FROM service_history WHERE MONTH(service_date) = ${i} AND YEAR(service_date) = ${year} `;
        }
        db.query(queryText, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results)
            }
        })
    })

    // getTopServicedEquipments
    server.get('/getTopServicedEquipments', (req, res) => {
        let year = req.query.year;
        let query = `SELECT E.description AS name, E.asset_no AS asset, COUNT(S.equipment_ID_FK) AS count FROM service_history S INNER JOIN equipments E ON S.equipment_ID_FK = E.record_ID WHERE YEAR(S.service_date) = ${year} AND S.service_status = 1 AND S.service_type != 'ppm' GROUP BY E.description ORDER BY count DESC LIMIT 5`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results)
            }
        })
    })
}