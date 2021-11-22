import './App.css';
import React, { useEffect, useState } from 'react';
import web3 from './web3';
import lottery from './lottery';

const App = () => {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [ethvalue, setEthValue] = useState('');
  const [message, setMessage] = useState('');

  const getValues = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting For Transaction...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(ethvalue),
    });

    setMessage('You have been entered !');
  };

  const handleOnClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage('A winner has been picked!');
  };

  // console.log(ethvalue);

  useEffect(() => {
    getValues();
  }, []);
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        {manager &&
          `This contract is managed by ${manager.slice(0, 4)}...${manager.slice(
            -4
          )}`}
      </p>
      <h4>
        There are currently {players.length} people enterd,competing to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </h4>
      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Want to try your luck</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={ethvalue}
            onChange={(e) => setEthValue(e.target.value)}
          />
        </div>
        <button type='submit'>Enter</button>
      </form>
      <h2>Ready to pick a winner</h2>
      <h3>Only contract manager can pick winner </h3>
      <button onClick={handleOnClick}>Pick a winner</button>

      <h2>{message}</h2>
    </div>
  );
};

export default App;
