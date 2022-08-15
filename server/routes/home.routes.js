module.exports = (server, db) => {

    server.post('/search', async (req, res) => {
        let data = req.body[0];
        let ppmData = req.body[1];
        let query = `SELECT * FROM equipments WHERE `;
        let values = [];
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].value) {
                if (count > 0) {
                    query += ` AND `;
                }
                count++;
                query += `${data[i].column} = ?`;
                values.push(`${data[i].value}`);
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
                query += `JULIANDAY(ppm_schedule) - JULIANDAY('now') < 30  AND JULIANDAY(ppm_schedule) - JULIANDAY('now') > 0 AND record_status = 1`;
                break;
            case 'over_due':
                query += `JULIANDAY(ppm_schedule) - JULIANDAY('now') < 0 AND record_status = 1`;
                break;
        }

        try {
            let statement = await db.prepare(query);
            await statement.bind(values);
            let results = await statement.all()
            res.send(results);
        } catch (error) {
            res.status(400).send(error);
        }
    })
}