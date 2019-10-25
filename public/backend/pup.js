const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const isDev = require('electron-is-dev');

// função de inicialização do Browser
async function setBrowser() {
  // quando o programa estiver em modo de produção o caminho do chromium muda
  // não encontrei um modo mais eficiente de mudar o caminho do chromium, por isso uso esse replace.
  const executablePath = isDev ? chromium.path : chromium.path.replace('app.asar', 'app.asar.unpacked');
  const browser = await puppeteer.launch({
    headless: true, // caso você ache conveniente, pode colocar aqui a variável isDev
    executablePath,
  });

  return browser;
}

async function getUserData(twitterUser = 'twitter') {
  const browser = await setBrowser();

  // aqui estamos instanciando a página onde tudo vai acontecer
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  // função que direciona o puppeter pra uma página específica
  await page.goto(`https://twitter.com/${twitterUser}`, { waitUntil: 'networkidle0' });

  // aqui estamos fazendo a captura de dados, vale destacar que o evaluate não é a única
  // forma de fazer isso eu pessoalmente gosto de usar o evaluate, pois ele é executado
  // na Page como uma injection. Por já ter costume com esse tipo extração, dou preferência
  // a ela, mas se você der uma olhada na documentação, vai descobrir que existem
  // outros metodos, alguns até mais eficientes

  const v = 'como passar variáveis para o evaluate?';

  const userData = await page.evaluate((vEval) => {
    // variável v que foi recebida, aqui ela tem o nome de vEval
    console.log(vEval);

    // aqui estou pegando a imagem de perfil do usuário
    const imgUrl = document.querySelector('.ProfileAvatar-image').src;

    // aqui estou pegando o nome do usuário
    const userName = document.querySelector('.ProfileHeaderCard-nameLink').innerText;

    // aqui estou pegando algumas outras informações, como número de tweets, seguidores e likes.
    const [
      tweets,
      following,
      followers,
      likes,
    ] = Array.from(document.getElementsByClassName('ProfileNav-value')).map((el) => el.innerText);

    // tudo o que eu peguei é retornado, tenha em mente que o evaluate não tem acesso a variáveis
    // que estão fora dele, então os dados que você capturar devem ser retornados para serem
    // acessíveis na função externa.
    return {
      imgUrl,
      userName,
      tweets,
      followers,
      following,
      likes,
    };
  // caso você queira passar alguma variável para o evaluate você tem que colocar ela aqui
  // como um argumento, todos os argumentos subsequentes a função do evaluate são passados
  // na mesma ordem para o evaluate
  }, v);

  // não se esqueça de fechar o browser depois do uso!
  await browser.close();

  // aqui por fim estou retornando os dados que eu peguei.
  return userData;
}

module.exports = {
  getUserData,
};
