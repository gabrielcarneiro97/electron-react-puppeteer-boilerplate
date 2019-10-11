const { ipcRenderer } = require('electron');
const { getUserData } = require('./pup');

ipcRenderer.on('getUserData', async (e, twitterUser) => {
  console.log('getUserData');
  const userData = await getUserData(twitterUser || undefined);
  ipcRenderer.sendTo(1, 'getUserDataResponse', userData);
});
