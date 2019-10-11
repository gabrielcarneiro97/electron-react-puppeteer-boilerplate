import React, { Component } from 'react';
import './App.css';

const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      userData: {},
      twitterUser: '',
    };
  }

  click = () => {
    const { twitterUser } = this.state;
    this.setState({ disabled: true }, async () => {
      ipcRenderer.sendTo(2, 'getUserData', twitterUser);
      ipcRenderer.once('getUserDataResponse', (e, userData) => {
        this.setState({ disabled: false, userData });
      });
    });
  }

  inputChange = (e) => {
    this.setState({
      twitterUser: e.target.value,
    });
  }

  render() {
    const { disabled, userData, twitterUser } = this.state;
    return (
      <div className="App">
        <input type="text" onChange={this.inputChange} value={twitterUser} />
        <button disabled={disabled} onClick={this.click}>
          Iniciar
        </button>
        {JSON.stringify(userData)}
      </div>
    );
  }
};

export default App;
