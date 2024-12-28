import { uint16 } from "../../@Types/Tipo_Inteiros";
import { Logger } from "../Lib/Logger";
import { Modulos_Struct } from "../../Models/Modulos/Modulos_Struct";
import { Pacotes_Socket } from "../../Models/Modulos/Pacotes_Socket";
import * as SocketIO from 'socket.io';



export class Socket_Server {

    // porta de listening de socket
    private port: uint16;

    // endereço para listening e / ou conexão com outro Core
    private endereco: string;

    // instancia do servidor socket
    private socketServer!: SocketIO.Server;

    // Instancia do Logger
    private _Logger: Logger;

    // Lista de Modulos conectados
    private _List_Modulos: Array<Modulos_Struct>;


    /**
     * Inicializador 
     * @param port numero da porta para o listener
     */
    constructor(port?: uint16, endereco?: string) {

        // Valida se foi definido uma porta para uso do Socket, caso nao utiliza a padrão 7000
        if (port != undefined) {
            this.port = port;
        } else {
            this.port = new uint16(7000);
        }
        // Valida se foi definido um ip para uso do Socket, caso nao utiliza o padrao 127.0.0.1
        if (endereco != undefined) {
            this.endereco = endereco;
        } else {
            this.endereco = "127.0.0.1";
        }
        this._Logger = new Logger();

        this._List_Modulos = new Array<Modulos_Struct>();
    }


    StartServer() {
        return new Promise<void>((resolv, reject) => {
            // Cria todos os listeners do servidor
            this.socketServer = new SocketIO.Server();

            /**
             * quando uma nova conexão inicia, é iniciado o listening para inicialização de um módulo novo, 
             * somente adicionando na listagem geral quando a inicialização é completada.
             */
            this.socketServer.on("connection", (clisocket) => {
                let Modulo_Conectado: Modulos_Struct = new Modulos_Struct();

                Modulo_Conectado.Socket = clisocket;


                /**
                 * Inicializa o listener de "init/modulos", para que o modulo conectado possa retornar a resposta de inicialização
                 *
                 */
                Modulo_Conectado.Socket.once('init/modulos/end_setup', (modData: Modulos_Struct) => {
                    this._Logger.System("[ServerSocket] Inicializando Módulo:", modData.Modulo_Nome, modData.Modulo_Versao);

                    Modulo_Conectado.Modulo_Nome = modData.Modulo_Nome;
                    Modulo_Conectado.Modulo_Descricao = modData.Modulo_Descricao;
                    Modulo_Conectado.Modulo_Versao = modData.Modulo_Versao;

                    // adiciona o Módulo a listagem de modulos conectados
                    this._List_Modulos.push(Modulo_Conectado);

                    // Retorna o Reconhecimento da inicialização do módulo.
                    Modulo_Conectado.Socket.emit("init/modulos/ack", {});
                })

                /**
                 * Emite para o módulo inicializar o setup retornando os dados necessarios para inicio
                 * da comunicação.
                 */
                Modulo_Conectado.Socket.emit("init/modulos/setup", Modulo_Conectado.toJson());

                /**
                 * Ouvinte de qualquer Evento criado,
                 * TODO: Melhoria de repasse de eventos para outro Módulo
                 */
                Modulo_Conectado.Socket.on("Pacote_Socket", (pacoteSocket: Pacotes_Socket, callback = (...retorno_callback: any) => { }) => {
                    try {
                        // this._Logger.Info("[ServerSocket] Pacote Generico Socket Recebido:", pacoteSocket);
                        // this._Logger.Info("[ServerSocket] Lista Listeners ", Modulo_Conectado.Socket.eventNames())
                        // this._Logger.Info("[ServerSocket] Lista Modulos ", this._List_Modulos.map((value) => { return value.toJson() }))

                        /**
                         * Realiza a pesquisa de todos os módulos conectados se existe um módulo correspondente
                         * para envio do pacote recebido
                         */
                        let ModRedirect = this._List_Modulos.find((mod) => {

                            /**
                             * TODO: Adicionar Verificador de Numero de conexões ativas e redirecionar para próximo módulo
                             * caso o numero exceda x simultaneas
                             * TODO: N.2 Adicionar formas de envio / comunicação multi módulos para quando um realiza o envio para todos os
                             * módulos versao xyz, broadcast. 
                             * 
                             */
                            //this._Logger.Log("[ServerSocket] modfind: ", mod.Modulo_Nome + "/" + mod.Modulo_Versao, pacoteSocket.destino)
                            // this._Logger.Log("[ServerSocket] modfind: ", "<" + mod.Modulo_ID + ">", "<" + pacoteSocket.destino + ">")

                            return (mod.Modulo_Nome + "/" + mod.Modulo_Versao == pacoteSocket.destino) ||
                                (mod.Modulo_Nome + "/*" == pacoteSocket.destino) || // Caso o destino seja qualquer versão
                                (mod.Modulo_Nome == pacoteSocket.destino) || // Caso o destino seja qualquer versão
                                (mod.Modulo_ID == pacoteSocket.destino);
                        })

                        /**
                         * Realiza o envio do pacote para o módulo de destino
                         */
                        if (ModRedirect != undefined) {
                            ModRedirect.Socket.emit(pacoteSocket.evento, pacoteSocket, callback);
                        } else {
                            this._Logger.Error("[ServerSocket] Nenhum modulo encontrado para o destino: ", pacoteSocket.destino);
                        }
                    } catch (err) {
                        this._Logger.Error("[ServerSocket] Ao converter dados recebidos pelo socket:\n", pacoteSocket, "\n", err);
                    }
                })


                Modulo_Conectado.Socket.on('disconnect', () => {
                    this._Logger.Info("Conexão Socket Finalizada:");

                    // Remove a instancia do módulo conectado caso haja desconexão
                    let indexMod = this._List_Modulos.indexOf(Modulo_Conectado);
                    if (indexMod > -1) {
                        this._List_Modulos.splice(indexMod, 1);
                    }
                })

                //this._List_Modulos.push(Modulo_Conectado);
            });

            // Inicia o servidor Socket
            /**
             * Socket IO somente suporta conexão de qualquer interface, para conexões em interfaces especificas
             * será necessario subir a instancia do socketio para baixo de outro listener (http, https, express ...)
             */
            this.socketServer.listen(this.port.value);
            this._Logger.System("[SocketServer] Inicializado servidor socket: ", this.port.value)
            resolv();
        });
    }

}