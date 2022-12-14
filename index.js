var express = require('express');
var router = express.Router();
require('dotenv').config();

router.get('/', async function (req, res) {


    const { BigQuery } = require('@google-cloud/bigquery');
    let salida;
    let salida2;
    let query = req.query;
    console.log("query entrada", query)
    async function Bigquery() {

        // Create a client
        const bigqueryClient = new BigQuery(
            {
                projectId: process.env.projectId,
                credentials: {
                    client_email: process.env.client_email,
                    private_key: process.env.private_key,
                },
            }
        );

        // The SQL query to run
        let sqlQuery = '';
        let concatenado = '';
        let paginadoFiltro = `order by ${query.order} ${query.typeOrder} limit ${query.limit} offset ${query.page}`;
        switch (query != undefined) {
            case query.filter != undefined && query.filterDate != undefined:
                if (Array.isArray(query.filter)) {
                    let param = '';
                    for (let index = 0; index < query.filter.length; index++) {
                        param += query.filter[index];
                    }
                    concatenado = `where ${param} ${query.filterDate[0]} between TIMESTAMP('${query.filterDate[1]}') and TIMESTAMP('${query.filterDate[3]}')`
                } else {
                    concatenado = `where ${query.filter} ${query.filterDate[0]} between TIMESTAMP('${query.filterDate[1]}') and TIMESTAMP('${query.filterDate[3]}')`
                }
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
        sqlQuery = `SELECT * FROM ${process.env.projectId}.${query.dataset}.${query.resource} ${concatenado} ${paginadoFiltro}`

        console.log("query", sqlQuery)
        let consulta2 = '';
        consulta2 = `SELECT count(*) FROM ${process.env.projectId}.${query.dataset}.${query.resource} ${concatenado != '' ? concatenado : ''}`

        const options = {
            query: sqlQuery,
            location: 'us-east1',
        };
        const options2 = {
            query: consulta2,
            location: 'us-east1',
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

router.get('/GET_MANY', async function (req, res) {


    const { BigQuery } = require('@google-cloud/bigquery');
    let salida;
    let { filter } = req.query;
    filter = JSON.parse(filter)
    console.log("query entrada", filter)
    async function Bigquery() {

        // Create a client
        const bigqueryClient = new BigQuery(
            {
                projectId: process.env.projectId,
                credentials: {
                    client_email: process.env.client_email,
                    private_key: process.env.private_key,
                },
            }
        );

        // The SQL query to run
        let sqlQuery = '';


        let param = [];
        for (let index = 0; index < filter.id.length; index++) {
            console.log(filter.id[index])
            param.push(`'${filter.id[index]}'`);
        }
        console.log("param", param)
        sqlQuery = `SELECT * FROM ${process.env.projectId}.testDt.testRa WHERE user_id in (${param})`

        console.log("query", sqlQuery)

        const options = {
            query: sqlQuery,
            location: 'us-east1',
        };


        //Run the query
        const [rows] = await bigqueryClient.query(options);

        salida = rows
        return res.status(200).json({
            json: salida
        })
    }

    Bigquery()

})



module.exports = router