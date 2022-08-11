const GOOGLE_APPLICATION_CREDENTIALS = require("./key.json");
var express = require('express');
var router = express.Router();

router.get('/', async function (req, res) {


    const { BigQuery } = require('@google-cloud/bigquery');
    let salida;
    let salida2;
    let query = req.query;
    console.log("query entrada", query)
    async function Bigquery() {

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
        let concatenado = '';
        let paginadoFiltro = `order by ${query.order} ${query.typeOrder} limit ${query.limit} offset ${query.page}`;
        switch (query != undefined) {
            case query.filter != undefined && query.filterDate != undefined:
                concatenado = `where ${Array.isArray(query.filter)
                    ? `${query.filter[0]} ${query.filter[1]} ${query.filterDate[0]} between TIMESTAMP('${query.filterDate[1]}') and TIMESTAMP('${query.filterDate[3]}')`
                    : `${query.filter} ${query.filterDate[0]} between TIMESTAMP('${query.filterDate[1]}') and TIMESTAMP('${query.filterDate[3]}')`}`
                break;
            case query.filterDate != undefined:
                concatenado = `where ${query.filterDate[0]} between TIMESTAMP('${query.filterDate[1]}') and TIMESTAMP('${query.filterDate[3]}') `
                break;
            case query.filter != undefined && Array.isArray(query.filter):
                concatenado = `where  ${query.filter.substring(0, query.filter.length - 4)} `
                break;
            default:
                concatenado = ``
                break;
        }
        sqlQuery = `SELECT * FROM ${GOOGLE_APPLICATION_CREDENTIALS.project_id}.${query.dataset}.${query.resource} ${concatenado} ${paginadoFiltro}`

        console.log("query", sqlQuery)
        let consulta2 = '';
        consulta2 = `SELECT count(*) FROM ${GOOGLE_APPLICATION_CREDENTIALS.project_id}.${query.dataset}.${query.resource} ${concatenado != '' ? concatenado : ''}`
        console.log("consulta2", consulta2)
        const options = {
            query: sqlQuery,
            location: 'US',
        };
        const options2 = {
            query: consulta2,
            location: 'US',
        };

        //Run the query
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