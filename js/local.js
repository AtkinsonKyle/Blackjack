'use strict';

var table = document.getElementById('scoreboard');
// loop through local storage and push the objects into an array
// Ron and Brei both helped.  Brei found the snippet of code that got us working.
if (localStorage) {
  var keys = Object.keys(localStorage),
    i = keys.length;
  while (i--) {
    var trEl = document.createElement('tr');
    // values.push(JSON.parse(localStorage.getItem(keys[i])));
    var tempObject = JSON.parse(localStorage.getItem(keys[i]));
    appendElement('td', tempObject.name, trEl);
    appendElement('td', tempObject.bankroll, trEl);
    appendElement('td', tempObject.turnsPlayed, trEl);
    table.appendChild(trEl);
  }
}

//Go through the array we just made and append it to the DOM

function appendElement(child, content, parent){
  console.log('hello');
  var newElement = document.createElement(child);
  newElement.textContent = content;
  parent.appendChild(newElement);
}

















