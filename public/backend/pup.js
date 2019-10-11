const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const isDev = require('electron-is-dev');

// função de inicialização do Browser
async function setBrowser() {
  const executablePath = isDev ? chromium.path : chromium.path.replace('app.asar', 'app.asar.unpacked');
  const browser = await puppeteer.launch({
    headless: true, // caso você ache conveniente, pode colocar aqui a variável isDev
    executablePath,
  });

  browser.setPage = async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    return page;
  };

  return browser;
}

async function getUserData(twitterUser = 'twitter') {
  const browser = await setBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  console.log(twitterUser);

  await page.goto(`https://twitter.com/${twitterUser}`, { waitUntil: 'networkidle2' });

  const userData = await page.evaluate(() => {
    const imgUrl = document.querySelector('.ProfileAvatar-image').src;
    const userName = document.querySelector('.ProfileHeaderCard-nameLink').innerText;
    const [
      tweets,
      following,
      followers,
      likes,
    ] = Array.from(document.getElementsByClassName('ProfileNav-value')).map((el) => el.innerText);
    return {
      imgUrl,
      userName,
      tweets,
      followers,
      following,
      likes,
    };
  });

  await browser.close();

  return userData;
}

module.exports = {
  getUserData,
};
