//3DES加密

import CryptoJS from 'crypto-js'

//3DES加密 Pkcs7填充方式
let encryptByDES = (message, key) => {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

export default encryptByDES;