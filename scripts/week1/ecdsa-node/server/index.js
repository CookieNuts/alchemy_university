const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
    "0xddbca93bd3ac6444bd1cb4c92363893cee641d97": 100,
    "0xe35fa1a43ef60de65a0e8b77df763529759e0a9f": 50,
    "0x7a3b2a5f9cb610176c47e98431c790832fad6b59": 75,
};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", (req, res) => {
    const { sender, recipient, amount, dataHex, signature, recoverBit } = req.body;

    setInitialBalance(sender);
    setInitialBalance(recipient);

    const data = {
        sender: sender,
        amount: parseInt(amount),
        recipient: recipient,
    };

    const checkDataHex = keccak256(utf8ToBytes(JSON.stringify(data)));
    const dataHexParse = new Uint8Array(dataHex);
    const signatureParse = new Uint8Array(signature);
    console.log("dataHexParse:", dataHexParse);
    console.log("checkDataHex:", checkDataHex);
    if (toHex(checkDataHex) !== toHex(dataHexParse)) {
        res.status(400).send({ message: "Send data modified!" });
    }

    const publicKey = getAddress(secp.recoverPublicKey(dataHexParse, signatureParse, recoverBit));
    console.log("sender:", sender);
    console.log("publicKey:", publicKey);
    if (publicKey !== sender) {
        res.status(400).send({ message: "Only sender send value!" });
    }

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

function getAddress(publicKey) {
    return '0x' + toHex(keccak256(publicKey.slice(1)).slice(-20));
}