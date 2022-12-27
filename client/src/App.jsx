import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [publicKey, setPublickKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return(
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        publicKey={publicKey}        
        privateKey={privateKey}
        setPublicKey={setPublickKey}
        setPrivateKey={setPrivateKey}/>
      <Transfer 
        setBalance={setBalance} 
        publicKey={publicKey}
        privateKey={privateKey}/>
    </div>
  );
}

export default App;
