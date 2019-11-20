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
                if (data.hostname) {
                    ComputerInfo = data;
                }
                socket.emit("hs", { status: 0 });

            })
            socket.on('data', function (data) {
                console.log("data:");
                console.log(data);
            });

            socket.on('disconnect', function () {
                console.log('PC disconnected');
            });
        });
}

module.exports = { start }