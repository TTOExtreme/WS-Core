
const Express = require('express');
const http = require('http');

const path = require("path").join;
const proxy = require("express-http-proxy");
const colors = require("colors")

class Hosts {

    _db;
    _log;
    _config;
    _wserver;
    _modules;
    _routes;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._db = WSMainServer.db;
        this._wserver = WSMainServer.wserver;
        this._events = WSMainServer.events;

        this._modules = WSMainServer.modules["WPMA"];
    }

    //Inicializar estruturas de Dados (cache das paginas principais)

    Init() {
        return new Promise((res, rej) => {
            this._events.on("WPMA/restartHosts",()=>{
                this._Restart();
            })
            this._events.setCoreEvent("WPMA/restartHosts")

            /**{
                 sites: [
                    {
                    id: 1,
                    name: 'Meu Primeiro Site',
                    description: 'Site de Exemplo',
                    createdBy: 1,
                    createdIn: '0',
                    modifiedBy: 1,
                    modifiedIn: '0',
                    route: '/',
                    subdomain: 'default.teste:8080',
                    folder: 'Default/',
                    log: 1,
                    active: 1,
                    deleted: 0
                    }
                ]
                }
            */

            this._routes = Express.Router();

            let internalPort = 9000;// initial port to each site for internal use only

            if (this._modules.cfg.sites) {

                this._modules.cfg.sites.forEach((part, index) => {
                    //create each site listener for each port
                    this._modules.cfg.sites[index]["internalPort"] = internalPort;
                    this._modules.cfg.sites[index]["app"] = new Express();
                    this._modules.cfg.sites[index]["http"] = http.createServer(this._modules.cfg.sites[index].app);
                    this._modules.cfg.sites[index].http.listen(this._modules.cfg.sites[index].internalPort, () => {
                        this._log.task("site-" + this._modules.cfg.sites[index].subdomain, "Site: " + this._modules.cfg.sites[index].name + " on Port: " + colors.green(this._modules.cfg.sites[index].internalPort), 1);
                    });

                    //initialize static response for pages
                    this._modules.cfg.sites[index].app.get("/", (reqest, response) => {
                        response.sendFile("/index.html", { root: path(__dirname + "/../webpages/" + this._modules.cfg.sites[index].folder) })
                    })


                    //create all proxy passages for each request
                    this._routes.use(proxy("localhost:" + internalPort, {
                        filter: (request, response) => {
                            return (request.headers.host == this._modules.cfg.sites[index].subdomain);
                        }
                    }))
                    internalPort++;
                });

                //this._wserver._app.get("*", (require, resolve, next) => this._HostWebPages(this._modules.cfg, require, resolve, next))
            }

            this._wserver._app.use(this._routes);
            this._log.task("loading-host_WPMA", "Initialized WPMA Host Manager", 1);
            res();
        })
    }


    /**
     * Processor for all web sites on host
     * @deprecated
     */
    _HostWebPages(cfg, req, res, next) {
        //domain/subdomain processor

        console.log(req.path);
        console.log(cfg);
        let site = cfg.sites.find((elem) => {
            return (elem.subdomain == req.headers.host);
        })
        console.log(site);
        if (site) {
            if (req.path == "/") {
                res.sendFile('./index.html', {
                    root: path(__dirname + "/../webpages/Default/")
                });
            } else {
                if (fs.existSync(path(__dirname + "/../webpages/" + site.folder + req.path)))
                    res.sendFile((req.path).substring(req.path.indexOf("/")), {
                        root: path(__dirname + "/../webpages/" + site.folder + (req.path).substring(0, req.path.lastIndexOf("/")))
                    });
            }
        } else {
            res.sendFile('./404.html', {
                root: this._config.webpageFolder
            });
        }
    }

    /**
     * Restart the hosting of sites
     */
    _Restart() {
        this._log.task("reloading-wpma", "Module WPMA Reloading", 0);
        this._modules.cfg.sites.forEach((part, index) => {
            if (this._modules.cfg.sites[index].http) {
                this._modules.cfg.sites[index].http.close();
            }
            this._log.task("stop-site-" + this._modules.cfg.sites[index].subdomain, "Stopping Site: " + this._modules.cfg.sites[index].name + " on Port: " + colors.green(this._modules.cfg.sites[index].internalPort), 1);
        });
        this.Init().then(() => {
            this._log.task("reloading-wpma", "Module WPMA Reloaded Done", 1);

        }).catch((err) => {
            this._log.task("reloading-wpma", "Module WPMA Reloading Error", 3);
            this._log.error("On Reloading Webpages");
            this._log.error(err);
        })
    }
}
module.exports = { Hosts }