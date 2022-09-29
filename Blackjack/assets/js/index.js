/* Inicio BlackJack */

let cards = []
let hand = [];
let dealerHand = [];
let handSum = 0;
let dealerHandSum = 0;

let ace = "Ás";
let jack = "J";
let queen = "Q";
let king = "K";

let espadasDeck = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king];
let copasDeck = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king];
let ourosDeck = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king];
let pausDeck = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king];

let deckFull = [espadasDeck, copasDeck, ourosDeck, pausDeck]

let balance = 100;
let aposta = 0;

let isAlive = true;
let isPlaying = false;
let endGame = false;
let alertMessage = false;
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
console.log(playingContainerEl)

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

function start() {
    startBgEl.style.display = "none";
}


function startGame() {
    if (isPlaying === false && isAlive === true && balance >= aposta && aposta > 0) {

        isBeatTurn = false;
        isDoubleTurn = true;

        balance = balance - aposta;
        balanceEl.textContent = `${balance}`;

        restartDecks(); /* Reinicia os decks, garantindo que todas as 52 cartas estão disponiveis */
        drawCardFunction(2); /* Compra duas cartas para o player */

        isDealerTurn = true;
        dealer();  /* compra e imprime a primeira carta para o dealer*/
        isFirstTurn = true;
        dealer();  /* compra a segunda carta do dealer, mas não exibe */
        isFirstTurn = false;
        isDealerTurn = false;

        startBtnEl.style.display = "none"; /* desabilita btn "Jogar" */
        playingBtnContainerEl.style.display = "flex"; /* abilita btns "Comprar" e "Manter" */
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

function restartDecks() {
    espadasDeck = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king];
    copasDeck = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king];
    ourosDeck = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king];
    pausDeck = [ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king];
    deckFull = [espadasDeck, copasDeck, ourosDeck, pausDeck]
    console.log(deckFull);
    cardsContainerEl.innerHTML = ``;
    cardsDealerContainerEl.innerHTML = ``;
}

function renderGame() {

    dealerHandSum = sumHand(); /* Atribui o valor real da mão do dealer para interpretação correta das regras do jogo */

    handEl.textContent = `Cartas: `;

    for (i = 0; i < hand.length; i++) {
        handEl.textContent += `${hand[i]} `; /* Imprime as cartas da mão do player */
    }

    totalEl.textContent = handSum;

    if (handSum <= 20 && isDealerTurn === false) {
        message = "Comprar uma nova carta?";
    } else if (handSum === 21) {
        isBlackJack = true;
        dealerStartHand()  /* Revela a mão do dealer sem comprar novas cartas */
        dealerPrintHand()
        win()
    } else if (handSum > 21 || dealerHandSum > handSum && dealerHandSum <= 21) {
        message = "Ops, você perdeu.";
        dealerStartHand()
        dealerPrintHand()
        loss()
    } else { /* nessas condições ou houve um empate ou vitoria do player */
        dealerStartHand()
        dealerPrintHand()
        win()
    }

    messageEl.textContent = message;
}

function drawCard() { /* Ativação de compra pelo botão "Comprar" */
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
        let naipe = getRandomInt(0, 4); /* Busca aleatoriamente um dos quatro naipes do baralho  */
        let card = deckFull[naipe][getRandomInt(0, deckFull[naipe].length)]; /* Seleciona aleatoriamente uma carta do naipe selecionado */

        if (isDealerTurn === false) {
            hand.push(card); /* Adiciona o valor da carta a mão do player */
        } else {
            dealerHand.push(card); /* Adiciona o valor da carta a mão do dealer */
        }

        let cardPosition = deckFull[naipe].indexOf(card);
        deckFull[naipe].splice(cardPosition, 1); /* Remove a carta do deck de naipe correspondente */

        naipe = naipeFinder(naipe); /* Converte o valor da posição do naipe em uma string com seu nome*/
        printCards(card, naipe); /* Imprime a imagem das cartas */

        card = royalCardTransform(card) /* Converte as cartas reais (Ás, K, Q, J) em números de acordo com suas pontuações */

        if (isDealerTurn === false) {
            handSum = sumHand(); /* Atribui o valor total das cartas contidas na mão do player */
            console.log(`player sum ${handSum}`)
        } else {
            dealerHandSum = sumHand(); /* Atribui o valor total das cartas contidas na mão do dealer */
            console.log(`dealer sum ${dealerHandSum}`)
        }
    }

}

function sumHand() {
    let total = 0;
    let acesFound = 0;

    /* Ás pode valer tanto 1pt quanto 11pts de acordo com a composição da mão */

    if (isDealerTurn === false) {
        for (i = 0; i < hand.length; i += 2) {
            if (hand[i] == "Ás") {
                acesFound += 1; /* Busca todos os Ás contidos na mão do player */
            } else {
                total += royalCardTransform(hand[i]); /* Soma todas as cartas a mão do player excluindo os Ás */
            }
        }
    } else if (isFirstTurn === true) {
        if (dealerHand[0] === "Ás") {
            acesFound += 1; /* Confere se a primeira carta da mão do dealer é um Ás */
        } else {
            total += royalCardTransform(dealerHand[0]);
        }

    } else { /* Ativa quando o dealer estiver comprando */
        for (i = 0; i < dealerHand.length; i += 2) { /* Somatorio comum e busca de Ás da mão do dealer */
            if (dealerHand[i] == "Ás") {
                acesFound += 1;
            } else {
                total += royalCardTransform(dealerHand[i]);
            }
        }
        if (acesFound >= 1) {
            isAcesFound = true;
        }
    }
    for (i = 0; i < acesFound; i++) {
        if (total <= 10) {
            total += 11; /* Se o valor das outras cartas somados ao Ás(11) não estourar 21, esse é considerado 11 */
        } else {
            total += 1; /* Se a mão for estourar, Ás = 1 */
        }
    }
    return total;
}

function dealer() {
    console.log("-------dealer--------")
    if (isAlive === true && isPlaying === true && isDealerTurn === false) {
        /* Condição necessária para drawCardFunction adicionar cartas a mão do dealer */
        dealerStartHand()
        isDealerTurn = true;
        while (dealerHandSum <= handSum && dealerHandSum < 17 && isBlackJack === false && dealerHand.length < 10 || isAcesFound === true && dealerHandSum <= handSum && dealerHandSum === 17 && isBlackJack === false && dealerHand.length < 10) {
            dealerHandSum = sumHand();
            console.log("Dealer comprou uma nova carta");
            drawCardFunction(1);
        }

        renderGame()

    } else if (isAlive === true) /* Condição para comprar cartas iniciais do dealer */ {
        console.log(`draw sem while`)
        drawCardFunction(1)
    }

    dealerPrintHand();

}

function dealerStartHand() {
    isDealerTurn = true;
    cardsDealerContainerEl.innerHTML = ""
    for (i = 0; i < dealerHand.length; i = i + 2) {
        printCards(dealerHand[i], dealerHand[i + 1])
    }


    dealerHandSum = sumHand();
    isDealerTurn = false;
}

function dealerPrintHand() {

    dealerHandEl.textContent = "Cartas Dealer: "
    if (isFirstTurn === true) { /* Exibe somente a primeira carta comprada */
        dealerHandEl.textContent += `${dealerHand[0]} ${dealerHand[1]}`
    } else {
        for (let card of dealerHand) { /* Exibe todas as cartas compradas */
            dealerHandEl.textContent += `${card} `;
        }
    }
    console.log(`Delear: ${dealerHand}`)
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
}

function dobrar() {
    if (isBeatTurn === false && isPlaying === true && balance >= aposta && isDoubleTurn === true) {
        balance = balance - aposta;
        aposta += aposta;
        console.log(handSum)
        drawCardFunction(1);
        dealer();
    }
}

function printCards(cardToPrint, naipeToPrint) {
    let cardToPrintName = translateCard(cardToPrint);
    let cardToPrintNaipe = translateNaipe(naipeToPrint);

    let cardToPrintFull = `${cardToPrintName}_of_${cardToPrintNaipe}`;

    if (isDealerTurn === false) {
        cardsContainerEl.innerHTML += `<img src="./assets/img/${cardToPrintFull}.png">`;
    } else if (isFirstTurn === false) {
        cardsDealerContainerEl.innerHTML += `<img src="./assets/img/${cardToPrintFull}.png">`;
        console.log(`Print ${cardToPrintFull}`)
    } else {
        cardsDealerContainerEl.innerHTML += `<img src="./assets/img/backcard1.jpg">`;
    }
}

function translateCard(card) {
    let cardName = `${card}`;
    cardName = cardName.replace("Ás", "ace");
    cardName = cardName.replace("J", "jack");
    cardName = cardName.replace("Q", "queen");
    cardName = cardName.replace("K", "king");

    return cardName;
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
    if (isDealerTurn === true) {
        dealerHand.push(naipe)
    } else {
        hand.push(naipe);
    }
    return naipe;
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
}


function reiniciar() {

    if (alertMessage === true || endGame === true) {
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
        balance += moneyLost; /* Aqui o jogador recupera metade do que foi apostado */
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
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}



/* FIM BlackJack */