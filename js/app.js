'use strict';

//global variables
var deckArray = [];
var bet = 5;

//get elements from DOM
// var playerButtons = document.getElementById('playerbuttons');
var hitButton = document.getElementById('hit');
var stayButton = document.getElementById('stay');
var betButton = document.getElementById('bet');
var playerCards = document.getElementById('playerhand');
var dealerCards = document.getElementById('dealerhand');

// deck constructor
function DeckMaker(cardId, suit, value) {
  this.cardId = cardId;
  this.suit = suit;
  this.value = value;
  this.imgSrc = `./../images/game-page/card-faces/${this.cardId}${this.suit}.png`;
  deckArray.push(this); //eslint-disable-line
}

// instantiate the deck
var cardId = ['ace', 'jack', 'queen', 'king'];
var suits = ['clubs', 'hearts', 'spades', 'diamonds'];
function buildDeck() {
  for (var i = 0; i < suits.length; i++) {
    new DeckMaker(cardId[0], suits[i], 11);
    for (var j = 2; j < 11; j++) {
      new DeckMaker(j.toString(), suits[i], j);
    }
    for (var k = 1; k < cardId.length; k++) {
      new DeckMaker(cardId[k], suits[i], 10);
    }
  }
  shuffle();
}
// buildDeck();

for (var i = 0; i < deckArray.length; i++) {
  if (deckArray[i].cardId === 'ace') {
    deckArray[i].aceAdjuster = function (target) {
      if (target.handTotal > 21) {
        this.value = 1;
      }
    };
  }
}

// player object. name, bank, hand
var player = {
  name: 'name',
  bankroll: 100,
  handArray: [],
  handTotal: 0
};
var dealer = {
  handArray: [],
  handTotal: 0
};

// temp stuff to show bank roll
var tempBank = document.getElementById('temp-bank');
tempBank.innerHTML = player.bankroll;

// randomize function
function randomNumber() {
  return Math.floor(Math.random() * deckArray.length);
}

// player bet input function, check max against bankroll

// deal cards, push into player object and dealer hand
function getCard(target, targetEl) {
  var random = randomNumber();
  var card = deckArray[random];
  deckArray.splice(random, 1);
  // console.log(card);
  target.handArray.push(card);
  target.handTotal += card.value;
  appendCard(card, targetEl);
}
//Each cardContainer has three elements used in CSS animation
function appendCard(card, targetEl){
  var cardContainer = document.createElement('div');
  cardContainer.classList.add('cardContainer');
  var cardParent = document.createElement('div');
  cardParent.classList.add('cardParent');
  var cardFront = document.createElement('div');
  cardFront.classList.add('front');
  var cardImg = document.createElement('img');
  cardImg.src = card.imgSrc;
  var cardBack = document.createElement('div');
  cardBack.classList.add('front', 'back');
  cardBack.append(cardImg);
  cardParent.appendChild(cardFront);
  cardParent.appendChild(cardBack);
  cardContainer.append(cardParent);
  targetEl.appendChild(cardContainer);
  // console.log(card);
  if (dealer.handArray.length === 1 && player.handArray.length === 1 ){
    // do nothing
  }else{
    setTimeout(function(){
      flipCard(cardParent);
    }, 100);
  }
}
function flipCard(targetEl){
  // console.log(targetEl);
  targetEl.classList.toggle('flipme');
}

// Resets all of the turn variables and deals the initial four cards
function initialDeal(bet) {
  playerCards.innerHTML = '';
  dealerCards.innerHTML = '';
  player.handArray = [];
  player.handTotal = 0;
  dealer.handArray = [];
  dealer.handTotal = 0;
  player.bankroll -= bet;
  deckArray = [];
  buildDeck(); //eslint-disable-line
  getCard(player, playerCards);
  getCard(dealer, dealerCards);
  getCard(player, playerCards);
  getCard(dealer, dealerCards);
}

// if player hits
function playerHit(event) {//eslint-disable-line
  if (player.handTotal < 21) {
    getCard(player, playerCards);
  }
  if (player.handTotal > 21) {
    //bust
    calcTotals();
  }
  console.log(dealer.handTotal);
  console.log(player.handTotal);
}
// if player stays
function playerStay(event) {//eslint-disable-line
  hitButton.removeEventListener('click', playerHit);
  stayButton.removeEventListener('click', playerStay);
  // dealer turn
  // uncovers dealers hold card
  flipCard(document.getElementById('dealerhand').children[0].children[0]);

  while (dealer.handTotal < 17) {
    getCard(dealer, dealerCards);
  }
  calcTotals();
}


// player bet, initial bet is hard wired at 5 until
function playerBet(event) { //eslint-disable-line
  betButton.removeEventListener('click', playerBet);
  initialDeal(bet);
  tempBank = document.getElementById('temp-bank');
  tempBank.innerHTML = player.bankroll;
  hitButton.addEventListener('click', playerHit);
  stayButton.addEventListener('click', playerStay);
  console.log(dealer.handTotal);
  console.log(player.handTotal);
}

// call this function after all the stuff happens to calculate winner and new bank roll
function calcTotals() {
  console.log(`dealer total ${dealer.handTotal}, player total ${player.handTotal}`);
  if (player.handTotal > 21) {
    hitButton.removeEventListener('click', playerHit);
    stayButton.removeEventListener('click', playerStay);
    //bust  next turn
  } else if (dealer.handTotal > 21) {
    player.bankroll += bet * 2;
  } else if (player.handTotal === dealer.handTotal) {
    player.bankroll += bet;
  } else if (player.handTotal === 21) {
    player.bankroll += bet * 3.5;
    // next turn
  } else if (player.handTotal > dealer.handTotal) {
    player.bankroll += bet * 2;
  }
  // loss next turn
  nextTurn();
}

function nextTurn() {
  // local storage bankroll //
  betButton.addEventListener('click', playerBet);
  tempBank = document.getElementById('temp-bank');
  tempBank.innerHTML = player.bankroll;
}

function shuffle() {
  for (var i = 0; i < 1000; i++) {
    var deck1 = Math.floor((Math.random() * deckArray.length));
    var deck2 = Math.floor((Math.random() * deckArray.length));
    var resetDeck = deckArray[deck1];


    deckArray[deck1] = deckArray[deck2];
    deckArray[deck2] = resetDeck;
  }
}


// function dealerTurn(){
//   hitButton.removeEventListener('click', dealerTurn);
//   while (dealer.handTotal < 17){
//     getCard(dealer, dealerCards);
//   }
//   calcTotals();
// }

// function dealerHit(event) {
//   stayButton.removeEventListener('click', dealerHit);
//   if (dealer.handTotal < 21) {
//     getCard(dealer, dealerCards);
//   }
//   if (dealer.handTotal > 21) {
//     //bust
//     calcTotals();
//   }
// }



hitButton.addEventListener('click', playerHit);
stayButton.addEventListener('click', playerStay);
betButton.addEventListener('click', playerBet);

// player turn, hit, stay.  Conditional to add up hand total
// if bust lose money, next hand
// if stay dealer turn
// function playerInput(event){
//   if (event.target.id === 'hit'){
//     if (player.handTotal < 21){
//       getCard(player, playerCards);
//       if (player.handTotal > 21){
//         calcTotals();
//       }
//     }
//   } else if (event.target.id === 'stay'){
//     dealerTurn();
//   } else if (event.target.id === 'bet'){
//     initialDeal(bet);
//   }
//   console.log(`dealer total: ${dealer.handTotal}`);
//   console.log(`player total: ${player.handTotal}`);
//   tempBank.innerHTML = player.bankroll;
// }



// function calcTotals(){
//   console.log('hello total function');
//   if (dealer.handTotal > 21 || (player.handTotal > dealer.handTotal && player.handTotal < 21)){
//     console.log('player winner');
//     if (player.handTotal === 21){
//       player.bankRoll += (bet*3.5);
//     } else {
//       console.log(`the bet${bet} ... bank roll ${player.bankroll}`);
//       player.bankRoll += (bet*2);
//     }
//   }
// initialDeal(bet);
// }
// dealer turn,
//If 21 next turn
// if < 17 hit,
// else stay.

// save new bank total, wait for bet to start next hand

//event listeners
