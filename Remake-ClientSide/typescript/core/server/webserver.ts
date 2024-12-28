/**
 * webserver class 
 * handler for the pages and socket
 */

import { WSMainServer, WSConfig } from './main';
import { WSLog } from './utils/log';
import * as fs from 'fs';
import { join } from 'path';

import { createServer, Server } from 'http';
import * as Express from 'express';
import * as SocketIO from 'socket.io';


class WServer {

    private log: WSLog;
    private config: WSConfig;

    constructor(WSMainServer: WSMainServer) {
        this.log = WSMainServer.log;
        this.config = WSMainServer.config;
    }

    private webpage = join(__dirname + "../client");

    private app: Express.Application;
    private server: Server;
    private io: SocketIO.Server;

    /**
     * init
     */
    public init() {
        this.app = Express();

        this.server = createServer(this.app);
        this.io = SocketIO(this.server);

        this.server.listen(this.config.webPort, () => {
            this.log.info('Running server on port: ' + this.config.webPort);
        });

        this.webhost();
        this.socketHandler();
    }


    /**
     * handler for the webfiles 
     */
    private webhost() {
        this.app.use
    }






    /**
     * handler for auth and parser to events
     */

    private socketHandler() {

        this.io.on('connect', (socket: any) => {

            socket.on("data", (callback) => {
                callback("Ola");
            })

            socket.on('message', (m: string) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

}


export { WServer };