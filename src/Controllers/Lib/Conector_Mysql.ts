import * as mysql from "mysql2";
import { uint16 } from "../../@Types/Tipo_Inteiros";
import { Logger } from "./Logger";


export class Conector_Mysql {

    // Instancia da conexão com o Banco de dados
    private _BD!: mysql.Connection;

    // Dados de credencial de conexão com o banco de dados Mysql
    private _credenciais!: credenciais_bd;

    // Classe Logger para log de ações / erros
    private _Logger: Logger = new Logger();


    constructor(mysql_usuario: string, mysql_senha: string, mysql_database: string, mysql_host: string, mysql_porta: uint16) {
        /**
         *  Gambiarra para conversão / extração do valor numerico "number" do type "uint16", o mesmo diretamente na definição do 
         *    this._credenciais não aceita devido a divergencia de Type.
         */
        const nporta: number | any = mysql_porta;

        /**
         * Transform dos dados recebidos para formato aceito do mysql2
         */
        this._credenciais = {
            user: mysql_usuario,
            password: mysql_senha,
            database: mysql_database,
            host: mysql_host,
            port: nporta,
        }
    }


    /**
     * Inicializa a conexão com o banco de dados
     * @returns 
     */
    Conectar(): Promise<void> {
        return new Promise((resolve, reject) => {

            if (this._BD == undefined) {
                //Realiza o instanciamento da conexão do banco
                this._BD = mysql.createConnection(this._credenciais);

                //Inicializa a conexão e retorna no promise quando conectado
                this._BD.connect((err) => {
                    if (err) {
                        this._Logger.Error("Ao conectar no banco de dados:", err);
                        reject("Ao conectar no banco de dados, favor verificar o log de erros");
                    } else {
                        this._Logger.System("Conectado ao Banco de dados:", this._credenciais.host + ":" + this._credenciais.port);
                        resolve();
                    }
                })
            } else {
                resolve();
            }
        })
    }

    /**
     * Executa uma query no banco garantindo a tratativa quanto a SQL injection.
     * @param sql Código SQL para ser executado, com ? nos locais de variaveis/valores
     * @param valores Array JSON contendo os valores para a query solicitada em sequencia
     * @returns Promessa contendo o resultado
     */
    Query(sql: string, valores: Array<any>): Promise<mysql.QueryResult> {
        return new Promise((resolve, reject) => {
            if (this._BD != null) {
                this.Conectar().then(() => {
                    this._BD.query(sql, valores, (err, result) => {
                        if (err) {
                            this._Logger.Error("Ao executar a Query SQL: ", sql, valores);
                            this._Logger.Error(err);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    })
                }).catch((err) => {
                    this._Logger.Error("Ao executar a Query SQL: ", sql, valores);
                    this._Logger.Error(err);
                    reject(err);
                })
            }
        })
    }
}


/**
 * Classe para modelo das configurações da credencial de acesso ao Banco de Dados
 */
class credenciais_bd {
    user!: string;
    password!: string;
    database!: string;
    host!: string;
    port!: number;
}