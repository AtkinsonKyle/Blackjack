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

// temp stuff to show bank roll
var tempBank = document.getElementById('temp-bank');
tempBank.innerHTML = player.bankroll;

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

// if player hits
function playerHit(event){
  if (player.handTotal < 21){
    getCard(player, playerCards);
  }
  if (player.handTotal > 21){
    //bust
    calcTotals();
  }
}
// if player stays
function playerStay(event){
  hitButton.removeEventListener('click', playerHit);
  stayButton.removeEventListener('click', playerStay);
  // dealer turn
  while (dealer.handTotal < 17){
    getCard(dealer, dealerCards);
  }
  calcTotals();
}

// player bet, initial bet is hard wired at 5 until
function playerBet(event){
  betButton.removeEventListener('click', playerBet);
  initialDeal(bet);
}

// call this function after all the stuff happens to calculate winner and new bank roll
function calcTotals(){
  console.log(`dealer total ${dealer.handTotal}, player total ${player.handTotal}`);
  if (player.handTotal > 21){
    //bust  next turn
  } else (player.handTotal === 21){
    player.bankroll += bet*3.5;
    // next turn
  } 
}


function nextTurn(){

}





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

// function dealerTurn(){
//   playerButtons.removeEventListener('click', playerInput);
//   while (dealer.handTotal < 17){
//     getCard(dealer, dealerCards);
//   }
//   calcTotals();
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

