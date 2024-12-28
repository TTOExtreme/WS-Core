/**
 * Class de criptografia
 */
const crp = require('crypto-js');
const rs = require('randomstring');

class Bcypher {
    /**
     * Encriptation In SHA512
     * @param {String} mess 
     * @returns {String} SHA512 From mess
     */
    sha512(mess) {
        let r = crp.SHA512(mess).toString();
        return r;
    }

    /**
     * Encriptation Using AES
     * @param {String} key 
     * @param {String} message 
     * @returns {String} Encripted From message
     */
    crypt(key, message) {
        let r = crp.AES.encrypt(message, key).toString();
        return r;
    }

    /**
     * Desencriptation of String Using AES
     * @param {String} key 
     * @param {String} message 
     * @returns {String} Desencripted From message
     */
    uncrypt(key, message) {
        if (message == "0") { return "0"; }
        let r = crp.AES.decrypt(message, key);
        return r.toString(crp.enc.Utf8);
    }

    /**
     * Generates a hash message with 32 Chars 
     * @returns {String} Hash with 32 Chars
     */
    generate_crypt() {
        return rs.generate({
            charset: 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM7894561230',
            length: 32
        }).toString();
    };

    /**
     * Generates a hash salt with 4096 Chars 
     * @returns {String} Hash with 4096 Chars
     */
    generate_salt(length = 4096) {
        return rs.generate({
            charset: 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM7894561230',
            length: length
        }).toString();
    };
}

module.exports = { Bcypher };