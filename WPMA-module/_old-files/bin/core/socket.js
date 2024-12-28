const fs = require('fs');
const bcypher = require('../lib/bcypher')
const path = require("path");
const log = require('../rotine/sql/insert/log');

const salt = "VFRPRXh0cmVtZS1MdWNhc1JhbWFsaG9D";

let io;

const c = JSON.parse(fs.readFileSync(__dirname + "/../configs/server.json", 'utf8'));
let asd = 0;
function start(server) {
    server.socketIO = require('socket.io').listen(server);
    console.log("Socket Server Online ".green);

    server.socketIO.of("/").on('connection', function (socket) {
        //console.log("Connected to Root")
        //socket.emit("hs", { status: "0" })
    });
    //*/

    server.socketIO.of("/user").on("connection", function (socket) {
        console.log("Connected to User")
        let usrData = "";
        socket.emit("hs", { status: "0" })
        socket.on('auth', function (data) {
            require('../rotine/check/checkUser')(data.user, data.pass, (usr) => {
                if (usr != undefined) {
                    let usrData = usr;
                    usrData.pass = "";
                    socket.emit("auth-ok", JSON.stringify(usr));
                    require('../rotine/sql/update/users/connected')(usrData.UUID, 1, (data) => { });
                    require('../rotine/sql/update/users/lastLogin')(usrData.UUID, new Date().getTime(), (data) => { });
                    //Autenticado
                    loadRoutes(socket, usrData);
                } else {
                    socket.emit("auth-err", { status: 'ERROR', errmess: 'Usuario ou senha incorretos' })
                    require('../rotine/sql/update/users/lastTry')(data.user, new Date().getTime(), (data) => { });
                    console.log("[ERROR] Wrong Credentials ".red + ("" + JSON.stringify(data)).gray);
                }
                let address = socket.handshake.address;
                //console.log(address);
                require('../rotine/sql/update/users/lastIp')(usrData.UUID, address, (data) => { });
            });
        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
            require('../rotine/sql/update/users/connected')(usrData.UUID, 0, (data) => { });
        });
    })
    //*/
}

function loadRoutes(socket, usrData) {

    socket.on('data', function (data) {
        try {
            let kdata = bcypher.uncrypt(usrData.UUID.substring(32, 48), data);
            let ldata = JSON.parse(kdata);
            require('./routes')(ldata, usrData.UUID, usrData.id_user, (rdata) => {
                socket.emit("data", bcypher.crypt(usrData.UUID.substring(0, 16), JSON.stringify(rdata)))
            })
        } catch (err) {
            console.log("[ERROR] Wrong Crypto ".red + ("\nhash:{" + JSON.stringify(data) + "}").gray + ("\nunhash:{" + kdata + "}").gray + ("\nUUID:{" + usrData.UUID + "}").gray + ("\nstack trace:{" + err + "}").gray);
            socket.emit("logout", {})
        }

    })
}


module.exports = { start };