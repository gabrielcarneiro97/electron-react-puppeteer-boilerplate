import React, { useState } from 'react';

// importação do ipcRenderer, note que estou usando o window.require
// para acessar bibliotecas do node que não são nativas do navegador
// elas devem ser importadas assim.
const { ipcRenderer } = window.require('electron');

// componente para exibição da imagem de perfil
const ImgPefil = ({ imgUrl }) => <img src={imgUrl} alt="imagem de perfil" height="200" />;


// componente para a exibição dos textos
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
  );
}

function App() {
  const [disabled, setDisabled] = useState(false);
  const [userData, setUserData] = useState({});
  const [twitterUser, setTwitterUser] = useState('');

  // função chamada quando o botão é clicado
  const click = () => {
    setDisabled(true);
    // aqui é enviada uma mensagem para o IPC de ID 2
    // o ID do IPC é relativo a criação das janelas no Electron
    // como a backgroundWindow foi criada depois da mainWindow,
    // o IPC da mainWindow tem ID = 1
    // e o IPC da backgroundWindow tem ID = 2.
    // O segundo argumento é o canal onde a chamada está sendo feita
    // veremos mais sobre isso quando estivermos analisando o arquivo process.js.
    // Por fim estamos passando o twitterUser para que o process saiba o que fazer.
    ipcRenderer.sendTo(2, 'getUserData', twitterUser);

    // o IPC não funciona como uma conexão HTTP onde toda chamada
    // tem uma resposta, sendo assim, a resposta com os dados é uma
    // chamada independente. Aqui usamos o once e não o on, pois estou
    // esperando apenas uma resposta, caso algum bug aconteça e uma
    // segunda chama ocorra, isso não impactará o funcionamento do app,
    // pois o listener já foi consumido, isso também evita
    // vários listeners ociosos enchendo a memória.
    ipcRenderer.once('getUserDataResponse', (e, responseData) => {
      setDisabled(false);
      // aqui os dados recebidos são passados para o React
      setUserData(responseData);
    });
  };

  const inputChange = (e) => setTwitterUser(e.target.value);

  return (
    <div style={{
      textAlign: 'center',
    }}
    >
      <div>
        <input type="text" disabled={disabled} onChange={inputChange} value={twitterUser} />
        <button
          type="button"
          disabled={disabled}
          onClick={click}
        >
          Iniciar
        </button>
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
export default App;
