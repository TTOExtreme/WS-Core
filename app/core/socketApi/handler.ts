import * as v1 from './v1/v1';
import * as SocketIO from 'socket.io';

let socketApi = [];

socketApi.push({ version: "/websocket/v1", handler: v1.socket });

function socketHandler(io: SocketIO.io) {
    socketApi.forEach(e => {
        e.handler(io.of(e.version))
    });
}

export { socketHandler }