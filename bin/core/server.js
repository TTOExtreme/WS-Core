const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const fs = require("fs");

const path = require('path')

var wid = 0;
var colors = require('colors')

const createServer = (_wid, webport) => {
    wid = _wid;
    server.listen(webport || 8000);

    console.log(("Server Started on: " + webport || 8000).green);

    console.log("up Main Web".green);
    /*
        app.get('/', function (req, res) {
            console.log("Homepage");
            res.sendFile(path.join(__dirname + '/../../web/'));
        });//*/

    app.use('/', express.static(path.join(__dirname + '/../../web/home/')));
    app.use('/login', express.static(path.join(__dirname + '/../../web/login/')));
    app.use('/libs', express.static(path.join(__dirname + '/../../web/libs/')));
    app.use('/comum', express.static(path.join(__dirname + '/../../web/comum/')));

    fs.readdirSync(path.join(__dirname + '/../modules/')).forEach(mod => {
        console.log("Loading Module: ".green + (mod).gray);
        app.use('/module/' + mod, express.static(path.join(__dirname + '/../modules/' + mod + "/web/")));
    })

    require('./socket').start(server);
    console.log("up Socket Web".green);

    if (wid == 1) {
        //require('../core/autoscan');
        //console.log("up AutoScan".green);
    }
}

module.exports = createServer