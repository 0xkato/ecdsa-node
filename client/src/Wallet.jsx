import server from "./server";

import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from "ethereum-cryptography/keccak";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, userSign, setUserSign, signHash}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey); 
    const address = toHex(secp.getPublicKey(privateKey));

    const messageHash = "caa0540304ec126f737a65ee31d171f89f0b1f46759730759f2ac6fc9556ecdb";

    const userSign = secp.sign(messageHash, privateKey, { recovered: true });
    const signHash= toHex(await userSign);

    setUserSign(userSign);
    console.log(signHash);

    //const recover = secp.recoverPublicKey("caa0540304ec126f737a65ee31d171f89f0b1f46759730759f2ac6fc9556ecdb", toHex(userSign), recoveryBit);
    //console.log(await recover);



    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
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
