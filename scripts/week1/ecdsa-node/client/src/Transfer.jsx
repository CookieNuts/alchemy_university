import { keccak256 } from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function transfer(evt) {
        evt.preventDefault();

        const data = {
            sender: address,
            amount: parseInt(sendAmount),
            recipient: recipient,
        };
        const dataHex = keccak256(utf8ToBytes(JSON.stringify(data)));
        const [signature, recoverBit] = await secp.sign(dataHex, privateKey, { recovered: true });
        data.dataHex = Array.from(dataHex);
        data.signature = Array.from(signature);
        data.recoverBit = recoverBit;

        try {
            const {
                data: { balance },
            } = await server.post(`send`, data);
            setBalance(balance);
        } catch (ex) {
            alert(ex.response.data.message);
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <div>
                PrivateKey: {privateKey}
            </div>

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
