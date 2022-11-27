const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04f13edea9823351407a147cc0e74133f6c64882d31f57465b7791d4c0c69c4e11329c9a97ac1b6c9cd34796cd18c1cdd5f6d8ef17e5daecba93194b7b2b4f5eea": 100,
  "04422428a0b25d6e21485fdcb62f86c68ac3e3a3975e938fb446ee072a676e0d0404ea9ea623e93517620d39cd808247660070707d08e8e90bee7acee0ac2ed751": 50,
  "047e9f281c78a60c846d56534f516c854a58f7b7ba5188f1019563e0d491cae53f30197f8a27032c00f3520f3fc3c61f531887c0a4d9ac3bb722d0f63b8f8370b4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a  signature from the client-side application 
  // recover the public address from the signature

  const { sender, recipient, amount } = req.body;

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
