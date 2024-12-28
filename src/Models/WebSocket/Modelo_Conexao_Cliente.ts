import { Socket } from "socket.io";
import { BCypher } from "../../Controllers/Lib/BCypher";



export class Conexao_Cliente {

    // Instancia de Controle do usuário
    /**
     * TODO Modelo de dados do usuário conectado 
     */
    public _Usuario: any;

    // Id da conexão iniciada pelo Cliente, id Unico da identificação da conexao
    public Conexao_ID: string;

    // Instancia da conexao Socket dessa conexao
    public Socket!: Socket;

    constructor() {
        //Gera um ID unico para a conexão do Cliente
        this.Conexao_ID = new BCypher().GenerateString(64);
    }

    /**
     * Utilizado para transmissao de dados por socket
     * retornando somente o essencial para a comunicação
     */
    toJson(): Object {
        return {
            Conexao_ID: this.Conexao_ID,
            Usuario: this._Usuario
        }
    }
}