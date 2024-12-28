import * as crypto from 'crypto-js';


export class BCypher {

    /**
     * Realiza a criptografia dos dados fornecidos em SHA3 que não é reversivel
     * @param dados String contendo os dados de input
     * @returns String com dados criptografados
     */
    sha3(dados: string): string {
        return crypto.SHA3(dados).toString();
    }


    /**
     * Realiza a criptografia dos dados fornecidos
     * @param dados String contendo os dados de input
     * @param key Chave de criptografia
     * @returns String com dados criptografados
     */
    Criptografar(dados: string, key: string): string {
        return crypto.AES.encrypt(dados, key).toString();
    }

    /**
     * Realiza a descriptografia dos dados fornecidos
     * @param dados String contendo os dados de input
     * @param key Chave de criptografia
     * @returns String com dados descriptografados
     */
    Descriptografar(dados: string, key: string): string {
        return crypto.AES.decrypt(dados, key).toString();
    }

    /**
     * Gerador de String com caracteres aleatórios
     * @param num_caracteres Quantidade de caracteres para ser gerada
     * @returns String aleatória de caracteres gerados
     */
    GenerateString(num_caracteres: number = 64) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*@#$!';
        let result = '';
        for (let i = 0; i < num_caracteres; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}