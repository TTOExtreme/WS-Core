import * as SocketIO from 'socket.io';
import * as Http from 'http';
import * as Https from 'https';
import { Logger } from '../Lib/Logger';
import { Conexao_Cliente } from '../../Models/WebSocket/Modelo_Conexao_Cliente';

export class Web_Socket {

    // Instancia do Logger
    private _Logger: Logger;

    // Instancia do Servidor Socket
    private SocketServer: SocketIO.Server;

    // Lista de Conexoes WebSocket
    private _List_Conexoes: Array<Conexao_Cliente>;

    constructor(Http_Https_Server: Http.Server | Https.Server) {

        // Inicializa a conexão Socket.IO com o Servidor Http/Https dependendo da configuração
        this.SocketServer = new SocketIO.Server(Http_Https_Server);

        // Inicializa a instancia do Logger
        this._Logger = new Logger();

        // Inicializa o Array de conexoes WebSocket
        this._List_Conexoes = new Array<Conexao_Cliente>();
    }


    /**
     * Inicia as rotas de Listening dos eventos do WebSocket
     */
    StartServer() {
        return new Promise<void>((resolv, reject) => {
            // Cria todos os listeners do servidor
            this.SocketServer = new SocketIO.Server();

            /**
             * quando uma nova conexão inicia, é iniciado o listening para inicialização de um módulo novo, 
             * somente adicionando na listagem geral quando a inicialização é completada.
             */
            this.SocketServer.on("connection", (clisocket) => {

                /**
                 * Instancia nova conexao do cliente e adiciona na lista de conexoes
                 */
                let Cliente_Conectado: Conexao_Cliente = new Conexao_Cliente();
                Cliente_Conectado.Socket = clisocket;
                this._List_Conexoes.push(Cliente_Conectado);


                /**
                 * TODO: Autenticação / Controle de comunicação com Modulo Core
                 */


                // /**
                //  * Inicializa o listener de "init/modulos", para que o modulo conectado possa retornar a resposta de inicialização
                //  *
                //  */
                // Cliente_Conectado.Socket.once('init/modulos/end_setup', (modData: Modulos_Struct) => {
                //     this._Logger.System("[ServerSocket] Inicializando Módulo:", modData.Modulo_Nome, modData.Modulo_Versao);

                //     Cliente_Conectado.Modulo_Nome = modData.Modulo_Nome;
                //     Cliente_Conectado.Modulo_Descricao = modData.Modulo_Descricao;
                //     Cliente_Conectado.Modulo_Versao = modData.Modulo_Versao;

                //     // adiciona o Módulo a listagem de modulos conectados
                //     this._List_Conexoes.push(Cliente_Conectado);

                //     // Retorna o Reconhecimento da inicialização do módulo.
                //     Cliente_Conectado.Socket.emit("init/modulos/ack", {});
                // })

                // /**
                //  * Emite para o módulo inicializar o setup retornando os dados necessarios para inicio
                //  * da comunicação.
                //  */
                // Cliente_Conectado.Socket.emit("init/modulos/setup", Cliente_Conectado.toJson());

                // /**
                //  * Ouvinte de qualquer Evento criado,
                //  * TODO: Melhoria de repasse de eventos para outro Módulo
                //  */
                // Cliente_Conectado.Socket.on("Pacote_Socket", (pacoteSocket: Pacotes_Socket) => {
                //     try {
                //         // this._Logger.Info("[ServerSocket] Pacote Generico Socket Recebido:", pacoteSocket);
                //         // this._Logger.Info("[ServerSocket] Lista Listeners ", Cliente_Conectado.Socket.eventNames())
                //         // this._Logger.Info("[ServerSocket] Lista Modulos ", this._List_Conexoes.map((value) => { return value.toJson() }))

                //         /**
                //          * Realiza a pesquisa de todos os módulos conectados se existe um módulo correspondente
                //          * para envio do pacote recebido
                //          */
                //         let ModRedirect = this._List_Conexoes.find((mod) => {

                //             /**
                //              * TODO: Adicionar Verificador de Numero de conexões ativas e redirecionar para próximo módulo
                //              * caso o numero exceda x simultaneas
                //              * TODO: N.2 Adicionar formas de envio / comunicação multi módulos para quando um realiza o envio para todos os
                //              * módulos versao xyz, broadcast. 
                //              * 
                //              */
                //             //this._Logger.Log("[ServerSocket] modfind: ", mod.Modulo_Nome + "/" + mod.Modulo_Versao, pacoteSocket.destino)
                //             // this._Logger.Log("[ServerSocket] modfind: ", "<" + mod.Modulo_ID + ">", "<" + pacoteSocket.destino + ">")
                //             return (mod.Modulo_Nome + "/" + mod.Modulo_Versao == pacoteSocket.destino) ||
                //                 (mod.Modulo_ID == pacoteSocket.destino);
                //         })

                //         /**
                //          * Realiza o envio do pacote para o módulo de destino
                //          */
                //         if (ModRedirect != undefined) {
                //             ModRedirect.Socket.emit(pacoteSocket.evento, pacoteSocket);
                //         } else {
                //             this._Logger.Error("[ServerSocket] Nenhum modulo encontrado para o destino: ", pacoteSocket.destino);
                //         }
                //     } catch (err) {
                //         this._Logger.Error("[ServerSocket] Ao converter dados recebidos pelo socket:\n", pacoteSocket, "\n", err);
                //     }
                // })


                Cliente_Conectado.Socket.on('disconnect', () => {
                    this._Logger.Info("Conexão WebSocket Finalizada");

                    // Remove a instancia do módulo conectado caso haja desconexão
                    let indexMod = this._List_Conexoes.indexOf(Cliente_Conectado);
                    if (indexMod > -1) {
                        this._List_Conexoes.splice(indexMod, 1);
                    }
                })

                //this._List_Conexoes.push(Cliente_Conectado);
            });

            // Inicia o servidor Socket
            /**
             * Socket IO somente suporta conexão de qualquer interface, para conexões em interfaces especificas
             * será necessario subir a instancia do socketio para baixo de outro listener (http, https, express ...)
             */
            this._Logger.System("[WebSocket] Inicializado servidor WebSocket Junto com instancia do WebServer")
            resolv();
        });
    }

}