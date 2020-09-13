'use strict';

var playerName = 'space loaf';

//global variables
var deckArray = [];
var bet = 0;

//get elements from DOM
var hitButton = document.getElementById('hit');
var stayButton = document.getElementById('stay');
var betButton = document.getElementById('playerbet');
var playerCards = document.getElementById('playerhand');
var dealerCards = document.getElementById('dealerhand');
var handTotalTracker = document.getElementById('handtotals');
document.getElementById('betinput').value = 5;

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

// player object. name, bank, hand
var player = {
  name: playerName,
  bankroll: 100,
  handArray: [],
  handTotal: 0
};
var dealer = {
  handArray: [],
  handTotal: 0
};

for (var m = 0; m <localStorage.length; m++){
  if (localStorage.key(m) === playerName){
    player = JSON.parse(localStorage.getItem(playerName));
    // dealer = JSON.parse(localStorage.getItem('dealer'));
  }
}

// var dealerSave = JSON.stringify(dealer);
var playerSave = JSON.stringify(player);
localStorage.setItem(playerName, playerSave);
// localStorage.setItem('dealer', dealerSave);

// temp stuff to show bank roll
var tempBank = document.getElementById('temp-bank');
tempBank.innerHTML = player.bankroll;

// deal cards, push into player object and dealer hand
function getCard(target, targetEl) {
  var card = deckArray[0];
  deckArray.splice(0, 1);
  // console.log(card);
  target.handArray.push(card);
  target.handTotal += card.value;
  if (target.handTotal > 21){
    target.handTotal = 0;
    for (var j = 0; j < target.handArray.length; j++){
      if (target.handArray[j].cardId === 'ace'){
        target.handArray[j].value = 1;
      }
    }
    for (var n = 0; n < target.handArray.length; n++){
      target.handTotal += target.handArray[n].value;
    }
  }
  appendCard(card, targetEl);
  playerSave = JSON.stringify(player);
  // dealerSave = JSON.stringify(dealer);
  localStorage.setItem(playerName, playerSave);
  // localStorage.setItem('dealer', dealerSave);
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
  //   STOPPED HERE
  // console.log(card);
  // var checkFlip = document.getElementById(dealerCards);
  // console.log(checkFlip);
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
  turnTotal(true);
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
  turnTotal(true);
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
  turnTotal(false);
  calcTotals();
}

// player bet, initial bet is hard wired at 5 until
  function playerBet(event) { //eslint-disable-line  
  event.preventDefault();
  bet = parseInt(event.target.betamount.value);
  if (bet < 5){
    alert('The minimum bet is 5');
  } else if (bet > player.bankroll){
    alert(`You can't cover that bet.  Please wager less than ${player.bankroll}`);
  } else {
    initialDeal(bet);
    betButton.removeEventListener('submit', playerBet);
    tempBank = document.getElementById('temp-bank');
    tempBank.innerHTML = player.bankroll;
    hitButton.addEventListener('click', playerHit);
    stayButton.addEventListener('click', playerStay);
    console.log(dealer.handTotal);
    console.log(player.handTotal);
  }
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
  } else if (player.handTotal === 21 && player.handArray.length === 2) {
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
  betButton.addEventListener('submit', playerBet);
  tempBank = document.getElementById('temp-bank');
  tempBank.innerHTML = player.bankroll;
}

// picks two random cards and switches their spots 1000 times
function shuffle() {
  for (var i = 0; i < 1000; i++) {
    var deck1 = Math.floor((Math.random() * deckArray.length));
    var deck2 = Math.floor((Math.random() * deckArray.length));
    var resetDeck = deckArray[deck1];
    deckArray[deck1] = deckArray[deck2];
    deckArray[deck2] = resetDeck;
  }
}

// function to output the totals of the player and dealer hand to the DOM
function turnTotal(hideHand){
  if (hideHand){
    handTotalTracker.children[0].textContent = dealer.handArray[1].value;
  } else {
    handTotalTracker.children[0].textContent = dealer.handTotal;
  }
  handTotalTracker.children[1].textContent = player.handTotal;
}

//event listeners for hit button, stay button and bet input form
hitButton.addEventListener('click', playerHit);
stayButton.addEventListener('click', playerStay);
betButton.addEventListener('submit', playerBet);
