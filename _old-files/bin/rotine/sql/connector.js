var mysql = require('mysql');
var fs = require('fs');

var c = JSON.parse(fs.readFileSync(__dirname + "/../../configs/dbconn.json", 'utf8'));
let connection = mysql.createConnection(c);
connection.connect();

module.exports = connection;
