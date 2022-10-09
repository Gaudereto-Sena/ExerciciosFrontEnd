/* Inicio BlackJack */


let deck = []
let hand = [];
let dealerHand = [];
let handSum = 0;
let dealerHandSum = 0;

let ace = "Ás";
let jack = "J";
let queen = "Q";
let king = "K";
let cards = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king]

let balance = 100;
let aposta = 0;

let isAlive = true;
let isPlaying = false;
let endGame = false;
let isBeatTurn = false;
let isDealerTurn = false;
let isFirstTurn = false;
let isBlackJack = false;
let hasGivenUp = false;
let isAcesFound = false;
let isDoubleTurn = false;

let message = "";
let startBgEl = document.getElementById("start-bg-el")
let messageEl = document.getElementById("message-el");
let totalEl = document.getElementById("total-el");
let handEl = document.querySelector("#hand-el");
let balanceEl = document.getElementById("balance-el");
let apostasEl = document.getElementById("apostas-el");
let dealerHandEl = document.getElementById("dealer-hand-el");
let dealerSumEl = document.getElementById("dealer-sum-el");
let cardsContainerEl = document.getElementById("cards-container-el");
let cardsDealerContainerEl = document.getElementById("cards-dealer-container-el")

let playingContainerEl = document.getElementById("playing-container");
let playingBtnContainerEl = document.getElementById("playing-btn-container");
let restartBtnContainerEl = document.getElementById("restart-btn-container");
let beatBtnContainerEl = document.getElementById("beat-btn-container");
let startBtnEl = document.getElementById("start-btn");
let restartBtnEl = document.getElementById("restart-btn");
let desistirBtnEl = document.getElementById("desistir-btn");



setUp();

function setUp() {
  /* Reinicia todos os textos e imagens para iniciar um novo jogo */

  message = "Confirme sua aposta para iniciar!";
  messageEl.textContent = message;
  totalEl.textContent = "0";
  handEl.textContent = "Cartas: -";
  balanceEl.textContent = `${balance}`;
  dealerHandEl.textContent = `Cartas Dealer: `;
  dealerSumEl.textContent = `0`;
  apostasEl.textContent = `0`;
  cardsContainerEl.innerHTML = `<img src="./assets/img/backcard1.jpg"><img src="./assets/img/backcard1.jpg">`;
  cardsDealerContainerEl.innerHTML = `<img src="./assets/img/backcard1.jpg"><img src="./assets/img/backcard1.jpg">`;
  aposta = 0;
  handSum = 0;
  dealerHandSum = 0;
  dealerHand = [];
  hand = [];
  isBeatTurn = true;
  endGame = false;
  isDealerTurn = false;
  isAcesFound = false;
  isBlackJack = false;
  isDoubleTurn = false;

  beatBtnContainerEl.style.display = "flex";
  startBtnEl.style.display = "block";
  playingContainerEl.style.display = "block"
  playingBtnContainerEl.style.display = "none"
  restartBtnEl.style.display = "none";
  desistirBtnEl.style.display = "none";
}

let Cards = class {
  constructor(valor, naipe) {
    this.valor = valor;
    this.naipe = naipe;
  }
}

var createDeck = function () {
  deck = [];

  for (let i = 0; i < 4; i++) {
    let naipe = naipeFinder(i);
    for (let i = 0; i < cards.length; i++) {
      let card = new Cards(cards[i], naipe);
      deck.push(card);
    }
  }

  cardsContainerEl.innerHTML = ``;
  cardsDealerContainerEl.innerHTML = ``;
  console.log(deck)
}

function start() {
  startBgEl.style.display = "none";
}

function startGame() {
  if (isPlaying === false && isAlive === true && balance >= aposta && aposta > 0) {

    isBeatTurn = false;
    isDoubleTurn = true;

    balance = balance - aposta;
    balanceEl.textContent = `${balance}`;

    /* restartDecks(); -------------------------------------------*/
    createDeck()
    /* Reinicia os decks, garantindo que todas as 52 cartas estão disponiveis */

    drawCardFunction(2);
    /* Compra duas cartas para o player */

    isDealerTurn = true;
    dealer();
    /* compra e printa a primeira carta para o dealer*/
    isFirstTurn = true;
    dealer();
    /* compra a segunda carta do dealer, mas não exibe */
    isFirstTurn = false;
    isDealerTurn = false;

    startBtnEl.style.display = "none";
    /* desabilita btn "Jogar" */

    playingBtnContainerEl.style.display = "flex";
    /* abilita btns "Comprar" e "Manter" */

    desistirBtnEl.style.display = "block";
    beatBtnContainerEl.style.display = "none";

    isPlaying = true;

    renderGame();

  } else if (isPlaying === true) {
    message = "Foco na partida!"
  } else if (isPlaying === false && balance < aposta) {
    message = "Adicione fundos e reinicie o jogo para mais uma partida!";
  } else if (aposta === 0) {
    message = "A aposta inicial deve ser maior que 0";
  }
  /* Condições para bloquear o btn "jogar" quando já se iniciou uma partida*/

  messageEl.textContent = message;
}

function renderGame() {

  dealerHandSum = sumHand();
  /* Atribui o valor real da mão do dealer para interpretação correta das regras do jogo */

  handEl.textContent = `Cartas: `;

  for (i = 0; i < hand.length; i++) {
    handEl.textContent += `${hand[i].valor} de ${hand[i].naipe} `;
    /* Imprime as cartas da mão do player */
  }

  totalEl.textContent = handSum;

  if (handSum <= 20 && isDealerTurn === false) {
    message = "Comprar uma nova carta?";
  } else if (handSum === 21) {
    isBlackJack = true;
    dealerPrintHand()
    /* Revela a mão do dealer sem comprar novas cartas */
    dealerLogHand()
    win()
  } else if (handSum > 21 || dealerHandSum > handSum && dealerHandSum <= 21) {
    message = "Ops, você perdeu.";
    dealerPrintHand()
    dealerLogHand()
    loss()
  } else {
    /* nessas condições ou houve um empate ou vitoria do player */
    dealerPrintHand()
    dealerLogHand()
    win()
  }

  messageEl.textContent = message;
}

function drawCard() {
  /* Ativação de compra pelo botão "Comprar" */

  if (isAlive === true && isPlaying === true) {
    console.log("Você comprou uma nova carta")
    isDoubleTurn = false;
    drawCardFunction(1)
    renderGame();
    console.log(`player: ${hand}`)
  }
}

function drawCardFunction(n = number) {/* Compra n cartas */
  for (let index = 0; index < n; index++) {

    let card = deck[getRandomInt(0, deck.length)]

    if (isDealerTurn === false) {
      hand.push(card);
      /* Adiciona o valor da carta a mão do player */
    } else {
      dealerHand.push(card);
      /* Adiciona o valor da carta a mão do dealer */
    }

    let cardPosition = deck.indexOf(card);
    deck.splice(cardPosition, 1)
    /* Remove a carta do deck */

    printCards(card.valor, card.naipe);
    /* Imprime a imagem das cartas */

    if (isDealerTurn === false) {
      handSum = sumHand();
      /* Atribui o valor total das cartas contidas na mão do player */

      console.log(`player sum ${handSum}`)
    } else {
      dealerHandSum = sumHand();
      /* Atribui o valor total das cartas contidas na mão do dealer */

      console.log(`dealer sum ${dealerHandSum}`)
    }

    console.log(deck)
  }

}

function sumHand() {
  let total = 0;
  let acesFound = 0;

  /* Ás pode valer tanto 1pt quanto 11pts de acordo com a composição da mão */

  if (isDealerTurn === false) {
    for (i = 0; i < hand.length; i++) {
      if (hand[i].valor === "Ás") {
        acesFound += 1;
        /* Busca todos os Ás contidos na mão do player */
      } else {
        total += royalCardTransform(hand[i].valor);
        /* Soma todas as cartas a mão do player excluindo os Ás */
      }
    }
  } else if (isFirstTurn === true) {
    if (dealerHand[0].valor === "Ás") {
      acesFound += 1;
      /* Confere se a primeira carta da mão do dealer é um Ás */
    } else {
      total += royalCardTransform(dealerHand[0].valor);

      /* Soma somente a primeira carta da mao do dealer */
    }

  } else {
    
    for (i = 0; i < dealerHand.length; i++) {
      /* Somatorio comum e busca de Ás da mão do dealer */

      if (dealerHand[i].valor === "Ás") {
        acesFound += 1;
      } else {
        total += royalCardTransform(dealerHand[i].valor);
      }
    }
    /* Ativa quando o dealer estiver comprando */

    if (acesFound >= 1) {
      isAcesFound = true;
    }
  }
  for (i = 0; i < acesFound; i++) {
    if (total <= 10) {
      total += 11;
      /* Se o valor das outras cartas somados ao Ás(11) não estourar 21, esse é considerado 11 */
    } else {
      total += 1;
      /* Se a mão for estourar, Ás = 1 */
    }
  }
  return total;
}

function dealer() {
  console.log("-------dealer--------")
  if (isAlive === true && isPlaying === true && isDealerTurn === false) {
    /* Condição necessária para drawCardFunction adicionar cartas a mão do dealer */
    dealerPrintHand()
    isDealerTurn = true;

    while (dealerHandSum <= handSum && dealerHandSum < 17 && handSum < 22 && isBlackJack === false && dealerHand.length < 5 || isAcesFound === true && dealerHandSum <= handSum && dealerHandSum === 17 && handSum < 22 && isBlackJack === false && dealerHand.length < 5) {
      dealerHandSum = sumHand();
      console.log("Dealer comprou uma nova carta");
      drawCardFunction(1);
    }

    renderGame()

  } else if (isAlive === true) {
    /* Condição para comprar cartas iniciais do dealer */

    console.log(`draw sem while`)
    drawCardFunction(1)
  }

  dealerLogHand();

}

function dealerPrintHand() {
  isDealerTurn = true;
  cardsDealerContainerEl.innerHTML = ""
  /* limpa o container de img das cartas do dealer */

  for (i = 0; i < dealerHand.length; i ++) {
    printCards(dealerHand[i].valor, dealerHand[i].naipe)
  }
  /* printa as cartas compradas pelo dealer */


  dealerHandSum = sumHand();
  isDealerTurn = false;
}

function dealerLogHand() {

  dealerHandEl.textContent = "Cartas Dealer: "
  if (isFirstTurn === true) {
    /* Exibe somente a primeira carta comprada */
    dealerHandEl.textContent += `${dealerHand[0]} ${dealerHand[1]}`
  } else {
    for (let card of dealerHand) {
      /* Exibe todas as cartas compradas em forma de texto*/
      dealerHandEl.textContent += `${card} `;
    }
  }

  dealerSumEl.textContent = `${dealerHandSum}`;
}

function dividir() {
  if (hand[0] === hand[2]) {

  }
  let handDivided = [];
  balance = balance - aposta;
  handDivided.push(hand[2], hand[3]);
  console.log(handDivided)
  hand.splice(2, 2)

  /* codigo a ser implementado. Quando o jogador comprar duas cartas ele pode dividir sua mão em duas apostas separadas e jogar com as duas */
}

function apostar(n = number) {
  if (isBeatTurn === true && aposta < balance) {
    for (i = 0; i < n; i++) {
      aposta += 1;
      if (aposta === balance) {
        break;
      }
    }
  } else if (aposta === balance) {
    message = "Adicione fundos para apostar mais";
  } else {
    message = "Aposta somente quando autorizado. Reinicie para apostar."
  }

  messageEl.textContent = message;
  apostasEl.textContent = `${aposta}`;

  /* função para os botões de bet */
}

function dobrar() {
  if (isBeatTurn === false && isPlaying === true && balance >= aposta && isDoubleTurn === true) {
    balance = balance - aposta;
    aposta += aposta;
    console.log(handSum)
    drawCardFunction(1);
    dealer();
  }
  /* O jogador pode dobrar a aposta e compra automaticamente uma nova carte e mantem a mão, passando para a vez do dealer */
}

function printCards(cardToPrint, naipeToPrint) {
  let cardToPrintName = translateCard(cardToPrint);
  let cardToPrintNaipe = translateNaipe(naipeToPrint);

  let cardToPrintFull = `${cardToPrintName}_of_${cardToPrintNaipe}`;

  if (isDealerTurn === false) {
    cardsContainerEl.innerHTML += `<img src="./assets/img/${cardToPrintFull}.png">`;
    console.log(`Print ${cardToPrintFull}`)
  } else if (isFirstTurn === false) {
    cardsDealerContainerEl.innerHTML += `<img src="./assets/img/${cardToPrintFull}.png">`;
    console.log(`Print ${cardToPrintFull}`)
  } else {
    cardsDealerContainerEl.innerHTML += `<img src="./assets/img/backcard1.jpg">`;
    console.log(`Print vira`)
  }
  /* Se a condição firstTurn for true, é printada uma carta escondida */

  /* Função que printa as cartas no html buscando pelos argumentos de valor da carta e seu naipe */
}

function translateCard(card) {
  let cardName = `${card}`;
  cardName = cardName.replace("Ás", "ace");
  cardName = cardName.replace("J", "jack");
  cardName = cardName.replace("Q", "queen");
  cardName = cardName.replace("K", "king");

  return cardName;

  /* Retorna o valor da carta em seus valores em inglês para funcionamento da função printCards() */
}

function translateNaipe(naipe) {
  let naipeCard = "";
  if (naipe === "espadas") {
    naipeCard = "spades"
  } else if (naipe === "copas") {
    naipeCard = "hearts"
  } else if (naipe === "ouros") {
    naipeCard = "diamonds"
  } else if (naipe === "paus") {
    naipeCard = "clubs"
  }

  return naipeCard;

  /* Retorna o naipe em inglês para funcionamento da função printCards() */
}

function naipeFinder(n = number) {
  let naipe = "";
  if (n === 0) {
    naipe = "espadas"
  } else if (n === 1) {
    naipe = "copas"
  } else if (n === 2) {
    naipe = "ouros"
  } else if (n === 3) {
    naipe = "paus"
  }
  return naipe;

  /* Retorna o nome do naipe de acordo com o argumento em função do array deckFull */
}

function royalCardTransform(card) {
  if (card === ace) {
    card = "1";
    card = parseInt(card);
  } else if (card === jack || card === queen || card === king) {
    card = "10";
    card = parseInt(card);
  }

  return card;

  /* retorna o valor da carta caso essa seja uma carta da fámilia real (ás, valete, dama e rei) de acordo com as regras do jogo */
}

function reiniciar() {

  if (endGame === true) {
    if (endGame === true) {
      setUp();
      isAlive = true;
      isPlaying = false;
      cardsContainerEl.innerHTML = `<img src="./assets/img/backcard1.jpg"><img src="./assets/img/backcard1.jpg">`;
      cardsDealerContainerEl.innerHTML = ``;
    }
  }


  if (isPlaying === false) {
    setUp()
  }
}

function desistir() {
  hasGivenUp = true;
  loss();
}

function loss() {
  let moneyLost = aposta;

  if (hasGivenUp === true) {
    moneyLost = aposta / 2;
    balance += moneyLost;
    /* Aqui o jogador recupera metade do que foi apostado */

    message = `Foi devolvido $${moneyLost} para sua conta`
  } else {
    message = `Você perdeu $${moneyLost}! `;
  }
  console.log("perdeu")
  endGameFunction();
}

function win() {
  let reward = 0;
  if (isBlackJack === true && dealerHandSum != 21) {
    reward = aposta * 5 / 2;
    balance += reward
    balance = Math.ceil(balance)
    message = `BlackJack!!! Você Ganhou $${reward}!`;
  } else if (dealerHandSum === handSum) {
    reward = aposta;
    balance += reward;
    message = `Empate! Foi devolvido $${reward} para sua conta`;
  } else {
    reward = 2 * aposta;
    balance += reward;
    message = `Você Ganhou $${reward}!`;
  }

  console.log("ganhou")
  endGameFunction();
}

function endGameFunction() {
  isAlive = false;
  isPlaying = false;
  endGame = true;
  hasGivenUp = false;
  aposta = 0;
  messageEl.textContent = message;
  balanceEl.textContent = `${balance}`;
  playingBtnContainerEl.style.display = "none"
  restartBtnEl.style.display = "block";
  desistirBtnEl.style.display = "none";
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
  // The maximum is exclusive and the minimum is inclusive
}



/* FIM BlackJack */