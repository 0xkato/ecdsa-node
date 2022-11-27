const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privteKey = secp.utils.randomPrivateKey();

console.log("privteKey", toHex(privteKey));

const publicKey = secp.getPublicKey(privteKey);

console.log("publicKey", toHex(publicKey));