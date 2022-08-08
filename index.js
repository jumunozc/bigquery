const GOOGLE_APPLICATION_CREDENTIALS = require("./key.json");
var express = require('express');
var router = express.Router();

router.get('/', async function (req, res) {


    const { BigQuery } = require('@google-cloud/bigquery');
    let salida;
    let salida2;
    async function Bigquery() {
        // Queries a public Shakespeare dataset.

        // Create a client
        const bigqueryClient = new BigQuery({
            projectId: GOOGLE_APPLICATION_CREDENTIALS.project_id,
            credentials: {
                client_email: GOOGLE_APPLICATION_CREDENTIALS.client_email,
                private_key: GOOGLE_APPLICATION_CREDENTIALS.private_key,
            },
        });

        // The SQL query to run
        let sqlQuery = '';
        sqlQuery = `SELECT * FROM ${GOOGLE_APPLICATION_CREDENTIALS.project_id}.testDt.testRa
        ${req.query.filter != undefined ? `where  ${req.query.filter.substring(0, req.query.filter.length - 4)} order by 
        ${req.query.order} ${req.query.typeOrder} limit ${req.query.limit} offset ${req.query.page}` :
                `order by ${req.query.order} ${req.query.typeOrder} limit ${req.query.limit} offset ${req.query.page}`} `

        let consulta2 = '';

        consulta2 = `SELECT count(*) FROM ${GOOGLE_APPLICATION_CREDENTIALS.project_id}.testDt.testRa`

        const options = {
            query: sqlQuery,
            location: 'us-east1',
        };
        const options2 = {
            query: consulta2,
            location: 'us-east1',
        };

        // Run the query
        const [rows] = await bigqueryClient.query(options);
        const [totalSql] = await bigqueryClient.query(options2)

        salida = rows
        salida2 = totalSql;
        return res.status(200).json({
            json: salida,
            total: salida2[0]
        })
    }

    Bigquery()

})



module.exports = router