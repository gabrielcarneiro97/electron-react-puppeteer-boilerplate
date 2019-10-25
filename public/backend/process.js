const { ipcRenderer } = require('electron');
// importação da função para pegar os dados.
const { getUserData } = require('./pup');

ipcRenderer.on('getUserData', async (e, twitterUser) => {
  const userData = await getUserData(twitterUser || undefined);
  ipcRenderer.sendTo(1, 'getUserDataResponse', userData);
});
