var express = require('express');
var cors = require('cors')
var ocr = require('./index')
var app = express();

// view engine setup



app.use(express.urlencoded());
app.use(express.json());
app.use(cors())
app.use('/', ocr)

const securePort = process.env.PORT || '5000'
app.listen(securePort, () => {
    console.log(`La api está escuchando en el puerto ${securePort}`)
})

module.exports = app;