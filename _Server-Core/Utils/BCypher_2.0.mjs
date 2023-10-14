/**
 * Modulo de cryptografia Versão 2.0.0
 */
import cryptoJs from "crypto-js";

export default class BCypher {

    constructor() {

    }

    /**
     * Criptografa a string de maneira irreversivel
     * @param {String} string 
     * @returns {String} hashed version of string
     */
    SHA2(string) {
        return cryptoJs.SHA512(string).toString();
    }

    /**
     * Criptografa a string usando a key como base
     * @param {String} string 
     * @returns {String} hashed version of string
     */
    encrypt(string, key) {
        return cryptoJs.AES.encrypt(string, key).toString();
    }

    /**
     * Descriptografa a string usando a key como base
     * @param {String} string 
     * @returns {String} hashed version of string
     */
    decrypt(string, key) {
        return cryptoJs.AES.decrypt(string, key).toString(crp.enc.Utf8);
    }

    /**
     * Descriptografa a string usando a key como base
     * @param {Number} length Default 64
     * @returns {String} hashed version of string
     */
    generateString(length = 64) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

}