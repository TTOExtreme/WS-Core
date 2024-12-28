import EventEmitter from "events";
import { BCypher } from "../../Controllers/Lib/BCypher";
import * as SocketIO from 'socket.io';


export class Modulos_Struct {

    // ID unico de identificação do Módulo, gerado ao inicializar. 
    Modulo_ID: string;
    // Nome do Módulo
    Modulo_Nome: string = "";
    // Descrição do Módulo
    Modulo_Descricao: string = "";
    // Versão do Módulo
    Modulo_Versao: string = "";
    // Numero de conexões ativas
    Modulo_Conexoes_Ativas: number = 0;
    // Numero maximo de conexoes ativas
    Modulo_Max_Conexoes: number = 10;


    // Listener de Eventos
    private _Events: EventEmitter;

    /**
     * Instancia da conexão socket com o Modulo
     * Somente utilizado para o controle do lado do servidor
     */
    Socket!: SocketIO.Socket;

    constructor() {
        //Gera um ID unico para a conexão Socket
        this.Modulo_ID = new BCypher().GenerateString(64);

        this._Events = new EventEmitter();
    }

    /**
     * Utilizado para transmissao de dados por socket
     * retornando somente o essencial para a comunicação
     */
    toJson(): Object {
        return {
            Modulo_ID: this.Modulo_ID,
            Modulo_Nome: this.Modulo_Nome,
            Modulo_Descricao: this.Modulo_Descricao,
            Modulo_Versao: this.Modulo_Versao
        }
    }
}