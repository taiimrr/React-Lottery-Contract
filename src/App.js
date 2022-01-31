import react from "react";

import web3 from "./web3";
import lottery from "./lottery";
import "./App.css";

function App() {
  const [manager, setManager] = react.useState("");
  const [players, setPlayers] = react.useState([]);
  const [balance, setBalance] = react.useState("");
  const [value, setValue] = react.useState("");
  const [message, setMessage] = react.useState("");

  const dataFunc = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
  };
  react.useEffect(() => {
    dataFunc();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    setMessage("You have been entered!");
    dataFunc();
  };

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage("A winner has been picked!");
    dataFunc();
  };
  return (
    <div className='App'>
      +<h1>Lottery Contract!</h1>
      <p>The contract is managed by {manager}</p>
      <p>
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether
      </p>
      <br></br>
      <hr></hr>
      <br></br>
      <h2>Want to try your luck?</h2>
      <form>
        <p>Amount of ether to enter</p>
        <input
          type='number'
          value={value}
          onChange={(e) => setValue(e.target.value)}></input>
        <button type='submit' onClick={onSubmit}>
          Enter
        </button>
      </form>
      <br></br>
      <hr></hr>
      <h2>Time to pick a winner?</h2>
      <button onClick={onClick}>Pick a Winner</button>
      <br></br>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
