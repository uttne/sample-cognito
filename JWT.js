// https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
// https://github.com/vthub/aws-react-jwt-auth/blob/master/lambda/index.js

// https://github.com/auth0/node-jsonwebtoken

const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const fetch = require('node-fetch');



const verify = () => new Promise(async (resolve) => {

    const jwtToken = 'XXXX.YYYY.ZZZZ';
    
    const region = "us-east-1";
    const userPoolId = "us-east-1_XXXXX";

    const response = await fetch(`https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`);
    const jwks = await response.json();

    const iss = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    const pems = {};

    const keys = jwks.keys;
    for(var i = 0; i < keys.length; i++){
        const key = keys[i];
        const key_id = key.kid;
        const modulus = key.n;
        const exponent = key.e;
        const key_type = key.kty;
        const jwk = {kty: key_type, n: modulus, e: exponent};
        const pem = jwkToPem(jwk);
        pems[key_id] = pem;
    }

    console.log(`token: ${jwtToken}`);

    const decodedJwt = jwt.decode(jwtToken, {complete: true});
    if(!decodedJwt){
        console.log("JWT Token をデコードできませんでした");
        resolve(false);
        return;
    }

    console.log("デコードされたトークン");
    console.log(decodedJwt);

    const kid = decodedJwt.header.kid;

    const pem = pems[kid];

    if(!pem){
        console.log("pem が見つかりませんでした");
        resolve(false);
        return;
    }

    if (decodedJwt.payload.token_use !== 'access') {
        resolve(false);
        return;
    }

    jwt.verify(jwtToken, pem, {issuer: iss}, (err, payload)=>{
        if (err){
            console.log(err);
            resolve(false);
            return;
        }
        else{
            console.log(payload);
            resolve(true);
            return;
        }
    })
});

module.exports = verify;