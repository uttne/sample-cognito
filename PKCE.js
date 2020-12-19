const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const fetch = require('node-fetch');
var crypto = require('crypto');

const base64URLEncode = (str) => {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};

const sha256 = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest();
};

const verify = () => new Promise(async (resolve) => {

    var verifier = base64URLEncode(crypto.randomBytes(32));
    var challenge = base64URLEncode(sha256(verifier));
    
    console.log("verifier: " + verifier);
    console.log("challenge: " + challenge);

    resolve(true);

});

module.exports = verify;