const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const fs = require("fs");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = JSON.parse(fs.readFileSync("../address.json"));

app.get("/balance/:publicKey", (req, res) => {
  const { publicKey } = req.params;
  const balance = balances[publicKey] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signatureResponse, msgHash, msg } = req.body;
  const { type, sender, recipient, sendAmount } = msg;
  const signature = Uint8Array.from(Object.values(signatureResponse[0]));
  const isSigned = secp.verify(signature, msgHash, sender);
  const isValid = recoverKey(msgHash, signature, signatureResponse[1], sender);

  if(isSigned && isValid){
    if(type === "transaction"){
      setInitialBalance(sender);
      setInitialBalance(recipient);

      if (balances[sender] < sendAmount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= sendAmount;
        balances[recipient] += sendAmount;
        res.send({ balance: balances[sender] });
      }
      
    } 
    else{
      res.send({ balance: balances[sender]});
    }
  }
  else{
    res.status(400).send({ message: "Invalid Transaction!"});
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function recoverKey(msgHash, signature, recoveryBit, sender){
  const recoverPubKey = toHex(secp.recoverPublicKey(msgHash, signature, recoveryBit));
  return recoverPubKey.toString() === sender.toString();
}