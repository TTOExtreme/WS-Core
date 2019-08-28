const fs = require('fs');
const bcypher = require('../lib/bcypher')
const log = require('../rotine/sql/insert/log');

const salt = "VFRPRXh0cmVtZS1MdWNhc1JhbWFsaG9D";

//var server;
var io;

var c = JSON.parse(fs.readFileSync(__dirname + "/../configs/server.json", 'utf8'));
var asd = 0;
function start(server) {
    io = require('socket.io').listen(server);
    console.log("Socket Server Online ".green);
    io.on('connection', function (socket) {
        var userUUID = "";
        var user_id = "";
        console.log('New Connection Arrives');
        socket.emit("hs", { status: 0 });
        socket.on('auth', function (data) {
            require('../rotine/check/checkUser')(data.user, data.pass, (usr) => {
                if (usr != undefined) {
                    var usrData = usr;
                    usrData.pass = "";
                    userUUID = usrData.UUID;
                    user_id = usrData.id_user;
                    //socket.join(usrData.UUID);
                    socket.emit("auth-ok", JSON.stringify(usr));
                    require('../rotine/sql/update/users/connected')(userUUID, 1, (data) => { });
                    require('../rotine/sql/update/users/lastLogin')(userUUID, new Date().getTime(), (data) => { });
                } else {
                    socket.emit("auth-err", { status: 'ERROR', errmess: 'Usuario ou senha incorretos' })
                    require('../rotine/sql/update/users/lastTry')(data.user, new Date().getTime(), (data) => { });
                    console.log("[ERROR] Wrong Credentials ".red + ("" + JSON.stringify(data)).gray);
                }
                var address = socket.handshake.address;
                //console.log(address);
                require('../rotine/sql/update/users/lastIp')(userUUID, address, (data) => { });
            });
        });
        socket.on('data', function (data) {
            try {
                var kdata = bcypher.uncrypt(userUUID.substring(32, 48), data);
                var ldata = JSON.parse(kdata);
                require('./routes')(ldata, userUUID, user_id, (rdata) => {
                    socket.emit("data", bcypher.crypt(userUUID.substring(0, 16), JSON.stringify(rdata)))
                })
            } catch (err) {
                console.log("[ERROR] Wrong Crypto ".red + ("\nhash:{" + JSON.stringify(data) + "}").gray + ("\nunhash:{" + kdata + "}").gray + ("\nUUID:{" + userUUID + "}").gray + ("\nstack trace:{" + err + "}").gray);
            }

        })
        socket.on('disconnect', function () {
            console.log('user disconnected');
            require('../rotine/sql/update/users/connected')(userUUID, 0, (data) => { });
        });
    });
}





function update(data, room) {

}

module.exports = { start, update };