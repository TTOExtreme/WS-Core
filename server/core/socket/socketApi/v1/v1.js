
const SocketIO = require('socket.io');
const CookieIO = require('cookie');

function socket(io) {
    io.on("connect", (socket) => {

        //try to authenticate user else redirect to login page
        try {
            //console.log(socket.request.headers)
            var cookies = CookieIO.parse(socket.handshake.headers.cookie);
            console.log(cookies);
            if (cookies.wscore) {
                //check in database for userID
            } else {
                socket.request.headers.origin += "./login"
            }
        } catch (err) {

            console.log(socket.handshake)
            socket.handshake.headers["Set-Cookie"] = CookieIO.serialize("wscore", "Sttring")
            console.log("Set-Cookie");
            console.log(socket.handshake)
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    })
}

module.exports = { socket }
