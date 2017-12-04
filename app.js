var bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var myRoutes = require('./routes.js');
app.use('/api', myRoutes);

var externalPort = 8080;

var server = app.listen(externalPort, function () {
    console.log('NodeJS server is online');
});

module.exports = server;