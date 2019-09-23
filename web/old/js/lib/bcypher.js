function sha512(mess) {
    var r = CryptoJS.SHA512(mess).toString();
    return r;
}

function crypt(key, mess) {
    var r = CryptoJS.AES.encrypt(mess, key).toString();
    return r;
}

function uncrypt(key, crypt_mess) {
    if (crypt_mess == "0") { return "0"; }
    var r = CryptoJS.AES.decrypt(crypt_mess, key);
    return r.toString(CryptoJS.enc.Utf8);
}