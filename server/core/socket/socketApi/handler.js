const v1 = require('./v1/v1');
const SocketIO = require('socket.io');

let socketApi = [];

socketApi.push({ version: "/websocket/v1", handler: v1.socket });

function socketHandler(io) {
    socketApi.forEach(e => {
        e.handler(io.of(e.version))
    });
}
module.exports = { socketHandler }