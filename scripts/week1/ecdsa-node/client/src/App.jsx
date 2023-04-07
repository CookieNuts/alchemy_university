import { useState } from "react";
import "./App.scss";
import Transfer from "./Transfer";
import Wallet from "./Wallet";

function App() {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    return (
        <div className="app">
            <Wallet
                balance={balance}
                privateKey={privateKey}
                setPrivateKey={setPrivateKey}
                setBalance={setBalance}
                address={address}
                setAddress={setAddress}
            />
            <Transfer
                setBalance={setBalance}
                address={address}
                privateKey={privateKey}
                setPrivateKey={setPrivateKey}
            />
        </div>
    );
}

export default App;
