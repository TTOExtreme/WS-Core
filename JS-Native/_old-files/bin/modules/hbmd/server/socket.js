const colors = require('colors');
const port = 9899;


function start(server) {
    console.log("HBMD Socket Online on: ".green + colors.gray(port));
    //console.log(server.socketIO)
    require('socket.io')(port).of("/HBMD")
        .on('connection', function (socket) {
            let ComputerInfo = {};

            socket.emit("hs", { status: 0 });
            //console.log(socket)
            console.log("Connected to HBMD")
            socket.on("auth", function (data) {
                if (data) {
                    ComputerInfo = data;
                }
                socket.emit("hs", { status: 0 });

            })
            socket.on('data', function (data) {
                //console.log("data:");
                //console.log(data);

                data.hostname = ComputerInfo.hostname;
                data.mac = ComputerInfo.mac;

                if (data.route == "CPU") {
                    require('./rotine/sql/insert/cpu')(data);
                }
                if (data.route == "NIC") {
                    require('./rotine/sql/insert/network')(data);
                }
                if (data.route == "System") {
                    require('./rotine/sql/insert/system')(data);
                }
                if (data.route == "MEM") {
                    require('./rotine/sql/insert/mem')(data);
                }
                if (data.route == "Disk") {
                    require('./rotine/sql/insert/disk')(data);
                }
                if (data.route == "DiskFiles") {
                    require('./rotine/sql/insert/diskFiles')(data);
                }
            });

            socket.on('disconnect', function () {
                console.log('PC disconnected');
            });
        });
}

module.exports = { start }