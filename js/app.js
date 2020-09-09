'use strict';

//global variables
var deckArray = [];

//get elements from DOM
var playerButtons = document.getElementById('playerbuttons');
var playerCards = document.getElementById('playerhand');
var dealerCards = document.getElementById('dealerhand');
var tempBank = document.getElementById('temp-bank');

// deck constructor
function DeckMaker(cardId, suit, value){
  this.cardId = cardId;
  this.suit = suit;
  this.value = value;
  // this.dealt = false;
  deckArray.push(this); //eslint-disable-line
}

// instantiate the deck
var cardId = ['ace', 'jack', 'queen', 'king'];
var suits = ['clubs', 'hearts', 'spades', 'diamonds'];
function buildDeck(){
  for (var i = 0; i < suits.length; i++){
    new DeckMaker(cardId[0], suits[i], 11);
    for (var j = 2; j < 11; j++){
      new DeckMaker(j.toString(), suits[i], j);
    }
    for (var k = 1; k < cardId.length; k++){
      new DeckMaker(cardId[k], suits[i], 10);
    }
  }
}
buildDeck();

for (var i = 0; i < deckArray.length; i++){
  if (deckArray[i].cardId === 'ace'){
    deckArray[i].aceAdjuster = function(target){
      if (target.handTotal > 21){
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

// randomize function
function randomNumber(){
  return Math.floor(Math.random() * deckArray.length);
}

// player bet input function, check max against bankroll

// deal cards, push into player object and dealer hand
function getCard(target, targetEl){
  var random = randomNumber();
  var card = deckArray[random];
  deckArray.splice(random, 1);
  // console.log(card);
  target.handArray.push(card);
  target.handTotal += card.value;
  var cardOut = document.createElement('div');
  cardOut.textContent = `${card.cardId}, ${card.suit}`;
  targetEl.appendChild(cardOut);
}

function initialDeal(bet){
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
  // console.log(player.handTotal);
  // console.log(dealer.handTotal);
}


// player turn, hit, stay.  Conditional to add up hand total
// if bust lose money, next hand
// if stay dealer turn
function playerInput(event){
  if (event.target.id === 'hit'){
    if (player.handTotal < 21){
      getCard(player, playerCards);
    } else {
      //bust
    }
    // if 21 announce bust and break
  } else if (event.target.id === 'stay'){
    playerButtons.removeEventListener('click', playerInput);
    if (dealer.handTotal > 16){
      // do nothing, stay
    } else {
      getCard(dealer, dealerCards);
    }
    // console.log('stay');
    // move onto dealer turn
  } else if (event.target.id === 'bet'){
    initialDeal(5);
    // console.log('bet');
  }
  console.log(`dealer total: ${dealer.handTotal}`);
  console.log(`player total: ${player.handTotal}`);
  tempBank.innerHTML = player.bankroll;
}



// dealer turn,
//If 21 next turn
// if < 17 hit,
// else stay.

// save new bank total, wait for bet to start next hand

//event listeners

playerButtons.addEventListener('click', playerInput);
