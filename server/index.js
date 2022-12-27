const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");

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
  const isValid = checkValidity(msgHash, signature, signatureResponse[1], sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
