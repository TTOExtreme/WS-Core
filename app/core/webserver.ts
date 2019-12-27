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
import { Request, Response, Router } from 'express';
import * as SocketIO from 'socket.io';

import * as bodyParser from 'body-parser';

import * as SocketHandler from './socketApi/handler';


class WServer {

    private log: WSLog;
    private config: WSConfig;

    constructor(WSMainServer: WSMainServer) {
        this.log = WSMainServer.log;
        this.config = WSMainServer.config;
    }

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
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.get("/login", (req, res) => {
            res.sendFile('./login.html', { root: this.config.webpageFolder });
        })
        this.app.post("/login/request", (req: Request, res: Response) => {

            //authenticate and redirect
            /**
             * TODO: Create Database and store User UUID for Each Session
             */
            res.cookie('wscore', "UUID", { expire: Date.now() + (24 * 60 * 60 * 1000) })
            res.redirect(302, "../")
        })
        this.app.get("/", (req, res) => {
            let cookies = this.parseCookies(req);
            if ((cookies["wscore"])) {//check if cookie is present and redirect if is not
                res.sendFile('./home.html', { root: this.config.webpageFolder });
            } else {
                res.redirect(302, "./login")
            }
        })
        this.app.use(Express.static(this.config.webpageFolder))
    }


    /**
     * @param request Request from client
     * @description Return client cookies from request
     */
    private parseCookies(request) {
        let list = {},
            rc = request.headers.cookie;
        rc && rc.split(';').forEach(function (cookie) {
            let parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;
    }



    /**
     * handler for auth and parser to events
     */
    private socketHandler() {
        SocketHandler.socketHandler(this.io)
    }

}


export { WServer };