import * as Http from 'http';
import * as Https from 'https';
import express from 'express';
import { Logger } from '../Lib/Logger';
import * as fs from "fs";
import { Config_WebServer } from '../../Models/Modelo_Configuracao';
import { Web_Socket } from './Web_Socket';



/**
 * Classe responsavel pelo controle de requests HTTP/HTTPs
 */
export class Web_Server {

    // instancia do servidor socket
    private socketServer!: Web_Socket;

    // Instancia do Logger
    private _Logger: Logger;

    // Modo de operação do WebServer
    private _Config: Config_WebServer;

    // Servidor Express, mantendo os Route e Midlewares
    private ExpressServer: express.Application;

    // Instancia de listening HTTPS
    private Https_Server!: Https.Server;

    // Instancia de listening HTTP
    private Http_Server!: Http.Server;


    /**
     * Inicializador 
     * @param port numero da porta para o listener
     */
    constructor(config: Config_WebServer) {

        // Inicializa a Instancia do Logger        
        this._Logger = new Logger();

        // Armazena a configuração vindo do arquivo principal de config
        this._Config = config;

        // Inicializa uma instância do Express.
        this.ExpressServer = express();
    }


    InicializarWebServer() {

        this._Logger.System("[WebServer] Iniciando o WebServer");
        /**
         * Para geração de certificados usando o lets encrypt segue o comando usando o certbot para geração
         *      # sudo certbot certonly --standalone --preferred-challenges http -d <DOMINIO> --agree-tos -m <EMAIL> --non-interactive --config-dir ./ --work-dir ./ --logs-dir ./  --rsa-key-size 8192
         * O comando acima ira gerar diversas pastas no local onde for executar, após finalização de geração (podendo ser acompanhado pelo comando:)
         *      # tail -f ./letsencrypt.log
         * O mesmo ira armazenar os certificados na seguinte pasta
         * 
         * Certificado: ./live/<DOMINIO>/fullchain.pem
         * Chave: ./live/<DOMINIO>/privkey.pem
         * 
         * podendo ser Mapeado no arquivo de config esses mesmos ou copialos para a raiz
         * OBS: Mantendo as pastas geradas, a renovação do certificado se torna mais facil e toda vez nao será necessario gerar um novo
         */


        // Definição da Rota Raiz para abrir o index.html
        this.ExpressServer.get('/', (req, res) => {
            res.write(fs.readFileSync(this._Config.Pasta_Arquivos_Html + '/index.html'));
        });
        // Definição das Rotas estaticas para chamar os arquivos da pasta principal
        this.ExpressServer.use('/', express.static(this._Config.Pasta_Arquivos_Html));

        /**
         * Verifica caso seja necessario um servidor HTTP para redirecionar para HTTPS
         */
        if (this._Config.Https_enable && this._Config.Http_redireciona_Https) {
            // Inicia um servidor HTTP independente 
            const httpApp = express();

            // Redireciona todo request http para https com o restante do path
            httpApp.get("*", function (req, res, next) {
                res.redirect("https://" + req.headers.host + req.path);
            });

            // Instancia a rota unica do Express para o listener http
            this.Http_Server = Http.createServer(httpApp);

            // Inicializa o Listener
            this.Http_Server.listen(this._Config.Porta.value, this._Config.Host, () => {
                this._Logger.System("[WebServer] Iniciado servidor HTTP para redirecionamento para HTTPS:", this._Config.Host + ":" + this._Config.Porta.value);
            });
        }

        /**
         * Inicializa um servidor HTTPS
         */
        if (!this._Config.Https_enable) {
            // Carrega o certificado gerado para o HTTPS
            const httpsOptions = {
                //certificado generico gerado para rodar o HTTPS corretamente
                key: fs.readFileSync(this._Config.Https_Chave),
                cert: fs.readFileSync(this._Config.Https_Certificado)
            };


            this.Https_Server = Https.createServer(httpsOptions, this.ExpressServer);
            //  Servidor HTTP configurado para rodar na porta 8080
            this.Https_Server.listen(this._Config.Porta_Https.value, this._Config.Host, () => {
                // Mensagem de retorno para saber se foi feito a conexão do webserver
                this._Logger.System("[WebServer] Iniciado servidor HTTPS:", this._Config.Host + ":" + this._Config.Porta_Https.value);
            });

            /**
             * Inicio da instancia de WebSocket em base do HTTPS
             */
            this.socketServer = new Web_Socket(this.Https_Server);
        } else {
            /**
             * Inicializa um servidor HTTP
             */
            this.Http_Server = Https.createServer(this.ExpressServer);
            //  Servidor HTTP configurado para rodar na porta 8080
            this.Http_Server.listen(this._Config.Porta.value, this._Config.Host, () => {
                // Mensagem de retorno para saber se foi feito a conexão do webserver
                this._Logger.System("[WebServer] Iniciado servidor HTTP:", this._Config.Host + ":" + this._Config.Porta.value);
            });

            /**
             * Inicio da instancia de WebSocket em base do HTTPS
             */
            this.socketServer = new Web_Socket(this.Http_Server);
        }
    }
}