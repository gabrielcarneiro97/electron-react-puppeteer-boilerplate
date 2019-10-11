import React, { Component } from 'react';

const { ipcRenderer } = window.require('electron');

function ImgPefil({ imgUrl }) {
  return <img src={imgUrl} alt="imagem de perfil" height="200" />;
}

function TextoData({ valor, nome }) {
  return (
    <div>
      <span style={{
        fontWeight: 'bold',
      }}
      >
        {nome}
        :
        &nbsp;
      </span>
      <span>
        {valor}
      </span>
    </div>
  )
}

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
      <div style={{
        textAlign: 'center',
      }}
      >
        <div>
          <input type="text" disabled={disabled} onChange={this.inputChange} value={twitterUser} />
          <button
            type="button"
            disabled={disabled}
            onClick={this.click}
          >
            Iniciar
          </button>
        </div>
        <div>
        </div>
        {
          userData.imgUrl !== undefined
          && (
            <>
              <div style={{
                marginTop: '10px',
              }}
              >
                <ImgPefil imgUrl={userData.imgUrl} />
              </div>
              <TextoData valor={userData.userName} nome="Nome de Usuário" />
              <TextoData valor={userData.followers} nome="Seguidores" />
              <TextoData valor={userData.following} nome="Seguindo" />
              <TextoData valor={userData.tweets} nome="Tweets" />
              <TextoData valor={userData.likes} nome="Likes" />
            </>
          )
        }

      </div>
    );
  }
};

export default App;
