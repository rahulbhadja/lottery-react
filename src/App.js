import logo from './logo.svg';
import './App.css';
import React from 'react';
import web3 from './web3';
import lottery from './lottery';

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          {this.state.manager &&
            `This contract is managed by ${this.state.manager.slice(
              0,
              4
            )}...${this.state.manager.slice(-4)}`}
        </p>
        <h4>
          There are currently {this.state.players.length} people
          enterd,competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </h4>
      </div>
    );
  }
}
export default App;
