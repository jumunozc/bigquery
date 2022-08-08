const GOOGLE_APPLICATION_CREDENTIALS = require("./key.json");
var express = require('express');
var router = express.Router();

/*
let sqlQuery = '';
                sqlQuery = `SELECT * FROM \`bigquery-public-data.github_repos.${resource}\``;

                if (filt > 0) {
                    sqlQuery += ` WHERE `;
                    for (var nombrevar in params.filter) {
                        const regex = /%/gi;   // para buscar por las ramas se separan los campos por %
                        var nv = nombrevar
                        console.log('nv', nv)
                        var nvv = nv.replace(regex, '.')
                        sqlQuery += `${nv} = '${params.filter[nombrevar]}' and `;
                    }
                }
                sqlQuery = sqlQuery.substring(0, sqlQuery.length -4)
                sqlQuery += `ORDER BY ${ordenx} ${order} 
                             LIMIT ${perPage}
                             OFFSET ${(page - 1) * perPage} `
*/

router.get('/', async function (req, res) {


    console.log("holaaaaa", req.query)
    const { BigQuery } = require('@google-cloud/bigquery');
    let salida;
    async function queryShakespeare() {
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
        sqlQuery = `SELECT * FROM conciliadortest.testDt.testRa
        ${req.query.filter != undefined ? `where  ${req.query.filter.substring(0, req.query.filter.length - 4)} order by 
        ${req.query.order} ${req.query.typeOrder} limit ${req.query.limit} offset ${req.query.page}` :
                `order by ${req.query.order} ${req.query.typeOrder} limit ${req.query.limit} offset ${req.query.page}`}

        `
        console.log("query", sqlQuery)
        const options = {
            query: sqlQuery,

            // Location must match that of the dataset(s) referenced in the query.
            location: 'us-east1',

        };

        // Run the query
        const [rows] = await bigqueryClient.query(options);
        salida = rows;
        return res.status(200).json({
            json: salida
        })
    }

    queryShakespeare()

})



module.exports = router