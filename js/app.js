// the icons/cards
const icons = ['fa-anchor','fa-bicycle','fa-diamond','fa-leaf','fa-bomb','fa-bolt','fa-paper-plane-o','fa-cube'];
let cards = [];

//populate cards array, I could type out the array but I let JavaScript do it
for (let x = 0; x <= 1; x++) {
 icons.forEach(c => {
   cards.push({
     icon: c,
     isMatching: false,
     isSolved: false
   })
 })
}

// GLobal DOM selectors, document fragmet, and variables
const starsDiv = document.querySelector('.stars');
const movesDiv = document.querySelector('.moves');
const resetButton = document.querySelector('.restart')
const scorePanel = document.querySelector('.score-panel');
const deck = document.querySelector('.deck');
const deckList = document.querySelectorAll('.deck');
const fragment = document.createDocumentFragment();
let state = {};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//show errors to user
const displayErrors = (err) => {
  const currentErrors = document.querySelector('.error-message');
  if (currentErrors) {
    closeErrors();
  }
  const errorMessage = `
  <div class="error-message">
    ${err}
    <a class="close" aria-label="Close">
      <span aria-hidden="true">×</span>
    </button>
  </a>`;
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-div';
  errorDiv.innerHTML = errorMessage;
  scorePanel.appendChild(errorDiv);
  const closeButton = document.querySelector('.close');
  closeButton.addEventListener('click', closeErrors);
}

// removes the error message
const closeErrors = () => {
  const errorDiv = document.querySelector('.error-div');
  errorDiv.remove();
}

//when a card is click
const handleClick = (e,i) => {
  // exit if user tries to click on a card that is already solved
  if (cards[i].isSolved === true) {
    displayErrors('It looks like you found this match already, try clicking a new card');
    return;
  }
  // exit if matching is occuring(2 cards have been selected), user can only click two cards at a time
  if (state.noClicks) {
    displayErrors('Be Patient young grasshopper, you can only try to match two cards at once');
    return;
  }
  // if we are not matching lets just flip the card
  if (!state.isMatching) {
    flipCard(e,i);
  } else {
    // if we are matching make sure we clicked on another card
    if (state.firstIndex === i) {
      state.noClicks = false;
      displayErrors('You just clicked this card, try clicking a new card');
      return;
    } else {
      // check the match
      checkMatch(e,i);
    }
  }
  state.isMatching = !state.isMatching;
}

// shows the card to the user and saves its details in the state object
const flipCard = (e,i) => {
  cards[i].isMatching = true;
  e.target.className = 'card open show';
  state.firstCard = e;
  state.firstIndex = i;
}

// checks if two cards selected match
const checkMatch = (e,i) => {
  // since we are checking a match lets make sure the user can't click
  state.noClicks = true;
  // get the icon from the card the user selected
  const icon = e.target.lastElementChild.classList[1];
  // filter solution object from cards array
  const solution = cards.filter(c => c.isMatching === true && c.isSolved === false);
  // show the card to the user
  e.target.className = 'card open show';
  // check if we have a match
  if ( solution[0].icon === icon) {
    handleMatch(e, i, true);
  } else {
    handleMatch(e, i, false);
  }
}

// display the match information to the user
const handleMatch = (e,i,match) => {
  // if match is false or we don't have a match
  if (!match) {
    // show bad match to user
    e.target.className = 'card bad';
    state.firstCard.target.className = 'card bad';
    // wait 1 second for animcations and then hide the cards again
    setTimeout(function(){
      e.target.className = 'card';
      state.firstCard.target.className = 'card';
    }, 1000);
  } else {
    // show the match to the user
    e.target.className = 'card match';
    state.firstCard.target.className = 'card match';
    // set the cards to solved in the cards object
    cards[i].isSolved = true;
    cards[state.firstIndex].isSolved = true;
    // add to the solutions counter
    state.solutions++;
  }
  // wait 1 second for animations
  setTimeout(function(){
    // for the first card reset isMatching in cards array
    cards[state.firstIndex].isMatching = false;
    // add to the moves counter and update the DOM with the new number
    state.moves++;
    movesDiv.textContent = state.moves;
    //checks if we have matched 8 cards in a game
    if (state.solutions === 8) {
      console.log('you won! yay!')
    }
    // let the user click on cards again
    state.noClicks = false;
  }, 1000)
}

// initializes the game
const startGame = () => {
  // setup initial state
  state = {
    isMatching: false,
    firstCard: {},
    firstIndex: null,
    noClicks: false,
    solutions: 0,
    moves: 0,
    stars: 3,
    errorMessage: ''
  }
  // update DOM
  movesDiv.textContent = state.moves;

  shuffle(cards);

  // build cards elements and append to DOM with event listener
  cards.forEach((c,i) => {
    const card = document.createElement('li');
    card.className = 'card match';
    card.innerHTML = `<i class='fa ${c.icon}'></i>`;
    card.addEventListener('click', (e) => {
      handleClick(e,i);
    });
    fragment.appendChild(card);
  })

  deck.appendChild(fragment);

  // wait 1.25 seconds and then hide the cards
  setTimeout(function() {
    for (let i = 0; i <= 15; i++) {
      deckList[0].childNodes[i].className = 'card';
    }
  }, 1250)

  // setup event listener for reset game button
  resetButton.addEventListener('click', () => {
    deck.innerHTML = '';
    startGame();
  })
}

// on DOM ready start the game
document.addEventListener("DOMContentLoaded", function(event) {
  startGame();
});
