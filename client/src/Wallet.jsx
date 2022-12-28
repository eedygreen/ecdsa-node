import { getPublicKey } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { useState } from "react";
import server from "./server";

function Wallet({ 
  balance, 
  setBalance, 
  setPublickKey,
  privateKey, 
  setPrivateKey }) {
    const [address, setAddress] = useState("")
    const [showError, setShowError] = useState("")
    async function onChange(evt) {
      const privateKeyHex = evt.target.value;
      setPrivateKey(privateKeyHex);
      try{
        const pubKeyArray = getPublicKey(privateKeyHex);
        const pubKeyHex = toHex(pubKeyArray);
        setPublickKey(pubKeyHex);
        const addressBytes = keccak256(pubKeyArray.slice(1));
        setAddress(`0x${toHex(addressBytes.slice(-20))}`);
      if (pubKeyHex) {
        const {
          data: { balance },
        } = await server.get(`balance/${pubKeyHex}`);
        setBalance(balance);
        setShowError(false);
      } else {
        setBalance(0);
      }
    } catch(error){
      console.error(error);
      setShowError(true);
      setAddress("");
      setBalance(0);
    }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        PRIVATE KEY
        <input placeholder="use your private key here, for example: 0x1" 
        value={privateKey} onChange={onChange}/>
      </label>
      {showError && <p className="
      error"> Invalid Private Key
      </p>} 
      <p> {
        address ? `Address: ${address.slice(0, 6)}...${address.slice(0, 4)}`
        : "."
        }
      </p>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}
}

export default Wallet;
