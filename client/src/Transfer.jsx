import { sign } from "ethereum-cryptography/secp256k1";
import { useState } from "react";
import server from "./server";
import toHash from "./utils/hash";

function Transfer({ setBalance, privateKey, publicKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      if (recipient && sendAmount) {
        const msg = { 
          type: "transactoin", 
          sender: publicKey, recipient, 
          sendAmount: parseInt(sendAmount) 
        };
        const msgHash = toHash(msg);
        const signatureResponse = await sign(msgHash, privateKey, { recovered: true, });
      
      const {
        data: { balance },
      } = await server.post(`send`, {
        signatureResponse,
        msgHash,
        msg,
      });
      setBalance(balance);
      alert("Sent!");
      setSendAmount("");
      setRecipient("");
    }
    else{
      alert("Fill the details");
    }
    } catch (error) {
      //alert(error.response.data.msg);
      console.log(`error:  ${error}`);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
