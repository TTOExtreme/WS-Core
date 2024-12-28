import { uint16 } from "../../@Types/Tipo_Inteiros";
import { Logger } from "../Lib/Logger";
import { Pacotes_Socket } from "../../Models/Modulos/Pacotes_Socket";
import EventEmitter from "events";
import { Modulos_Struct } from "../../Models/Modulos/Modulos_Struct";
import * as SocketIOClient from "socket.io-client";

export class Socket_Client {

    // porta de listening de socket
    private port: uint16;

    // endereço para listening e / ou conexão com outro Core
    private endereco: string;

    // instancia do servidor socket
    private socketIO!: any;

    // instancia do servidor socket
    public socketClient!: SocketIOClient.Socket;

    // Instancia do Logger
    private _Logger: Logger;

    // Instancia dod dados referentes ao Modulo que irá conectar
    public Modulo_Dados: Modulos_Struct;

    /**
     * Inicializador 
     * @param port numero da porta para o listener
     */
    constructor(port?: uint16, endereco?: string, dados_modulos: Modulos_Struct = new Modulos_Struct()) {

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

        this.Modulo_Dados = dados_modulos;
    }

    /**
     * Realiza a conexão com o Servidor e envia os dados de registros iniciais
     */
    Connect() {
        return new Promise<void>((resolv, reject) => {
            //Inicia a conexão socket com o servidor
            this._Logger.System("[ClienteSocket] Iniciando conexão Socket com: ", "http://" + this.endereco + ":" + this.port.value)
            this.socketClient = SocketIOClient.connect("http://" + this.endereco + ":" + this.port.value);

            /**
             * Handler de inicio de conxão com o servidor
             */
            this.socketClient.on("connect", () => {
                this._Logger.System("[ClienteSocket] Conectado ao socket:", this.endereco + ":" + this.port.value);

                /**
                 * Recebe uma call do servidor solicitando o envio de dados do módulo para inicialização
                 */
                this.socketClient.once("init/modulos/setup", (modData: Modulos_Struct) => {
                    this.Modulo_Dados.Modulo_ID = modData.Modulo_ID;

                    this._Logger.System("[ClienteSocket] Enviando setup do Módulo");
                    //Envia os dados do Módulo para o servidor
                    this.socketClient.emit("init/modulos/end_setup", this.Modulo_Dados.toJson());
                });

                this.socketClient.once("init/modulos/ack", (modData: Pacotes_Socket) => {
                    this._Logger.System("[ClienteSocket] Recebido confirmação da inicialização do módulo");

                    resolv();
                });
            })



            /**
             * Handler de Desconexão cliente servidor
             */
            this.socketClient.on('disconnect', (socket: any) => {
                this._Logger.System("[ClienteSocket] Desconectado do socket:", this.endereco + ":" + this.port.value);

                resolv();
            })


            this.socketClient.open();
            this.socketClient.connect();
            this.socketClient.io.connect();
        });
    }

    /**
     * Realiza o envio de dados para o servidor socket conectado
     * @param evento Nome do evento para enviar ao servidor Socket
     * @param dados Dados em JSON para envio
     */
    emit(evento: string, destino: string, dados: Object, callback = (...retorno_callback: any) => { }) {

        // Cria o Pacote de dados para envio
        let PacoteModulo = new Pacotes_Socket();
        PacoteModulo.destino = destino;
        PacoteModulo.evento = evento;
        PacoteModulo.origem = this.Modulo_Dados.Modulo_ID;

        // Compacta os dados do módulo para agregar ao Pacote do Socket
        PacoteModulo.dados = JSON.stringify(dados);

        // Envia ao servidor Socket
        this.socketClient.emit("Pacote_Socket", PacoteModulo, callback);
    }
}