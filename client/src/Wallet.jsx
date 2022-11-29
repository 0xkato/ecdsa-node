import server from "./server";

import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from "ethereum-cryptography/keccak";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, setUserSign}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey); 

    const address = privateKey;

    const messageHash = "caa0540304ec126f737a65ee31d171f89f0b1f46759730759f2ac6fc9556ecdb";

    const userSign = await secp.sign(messageHash, privateKey);
    const signHash= toHex(userSign);
    const publicKey = await secp.getPublicKey(privateKey);

    setUserSign(userSign);
    console.log("Sign hash: ", signHash);

    
    const isSigned = await secp.verify(userSign, messageHash, publicKey, {recovered: Boolean = true});
    console.log("Is signed ",isSigned);

    const recovered = await secp.recoverPublicKey(messageHash,userSign, 1);
    
    console.log("Recovered public Key: ", toHex(await recovered));
    console.log("public Key: ",toHex(await publicKey));

    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      console.log(balance);
    } else {
      setBalance(0);
    }

  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in your Private Key" value={privateKey} onChange={onChange}></input>
      </label>
      <div>address: {address.slice(0,5)}</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
