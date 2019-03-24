//Defines global variables and creates a list to hold card types
const cardTypes = ['fa-diamond', 'fa-diamond', 
			'fa-paper-plane-o', 'fa-paper-plane-o', 
			'fa-anchor', 'fa-anchor', 
			'fa-bolt', 'fa-bolt', 
			'fa-cube', 'fa-cube', 
			'fa-leaf', 'fa-leaf', 
			'fa-bicycle', 'fa-bicycle', 
			'fa-bomb', 'fa-bomb'];

let openCards = []; //Keeps track of open cards
let matchCount = 0; //Keeps track of how many matches have been made
let timeElapsed = 0; //Keeps track of the time elapsed since the start of the game
let moveNumber = 0; //Keeps track of how many moves have been made
let starCount = 3; //Keeps track of number of stars

//Starts functions to begin
startTimer();
gameStart();
restartGame();

//Starts the timer
function startTimer() {
	setInterval(function() {
		timeElapsed += 1;
		minElapsed = Math.floor(timeElapsed / 60);
		secElapsed = timeElapsed % 60;
		document.querySelector('.timer').innerHTML = `Time Elapsed: ${minElapsed}m ${secElapsed}s`
	}, 1000);
}

//Starts the game
function gameStart() {
	
	//Resets tracking variables
	openCards = [];
	matchCount = 0;
	timeElapsed = 0;
	moveNumber = 0;
	starCount = 3;
	
	//Resets number of moves and star rating on the page
	document.querySelector('.moves').innerHTML = `${moveNumber}`;
	setStars(document.querySelector('.stars'));

	//Ensures the game board is visible and the won modal is not visible
	const gameElements = document.querySelector('.container');
	for (let i = 0; i < gameElements.children.length; i++) {
		if (gameElements.children[i].classList.contains('won_hide')) {
			gameElements.children[i].classList.remove('won_hide');
		} else if (gameElements.children[i].classList.contains('won_display')) {
			gameElements.children[i].classList.remove('won_display');
		}
	}

 	//Displays the cards on the page by shuffling the cards, looping through them to create their HTML, and adding them to the page
	let deck = null;
	deck = document.querySelector('.deck');
	deck.innerHTML = ``;
	let shuffledDeck = shuffle(cardTypes);
	for (let cardType of shuffledDeck) {
		deck.innerHTML += `<li class="card">
							<i class="fa ${cardType}"></i>
							</li>`;
	}

	//Starts to check for clicks
	startListener();
}

//Restarts the game when user clicks Restart button
function restartGame() {
	let restartButton = document.querySelector('.restart');
	restartButton.addEventListener('click', function(event) {
		gameStart();
	})
}

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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function startListener() {
	const cards = document.querySelectorAll('.card');
	for (let card of cards) {
		card.addEventListener('click', function(event) {
			if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match') && openCards.length < 2) {
				displaySymbol(card);
			}
		})
	}
}

//Open the clicked card to display its symbol
function displaySymbol(card) {
		card.classList.add('open','show');
		addCardToList(card);
}

//Add card to list of open cards; update move number, update star rating, and check for match if necessary
function addCardToList(card) {
	openCards.push(card)
	if (openCards.length === 2) {
		moveNumber += 1;
		setStars(document.querySelector('.stars'));
		document.querySelector('.moves').innerHTML = `${moveNumber}`;
		checkMatch();
	}
}

//Check to see if there is a match
function checkMatch() {
	if (openCards[0].querySelector('i').className === openCards[1].querySelector('i').className) {
		yesMatch();
	} else {
		noMatch();
	}	
}

//If there is a match, change color and keep cards open
function yesMatch() {
	for (let openCard of openCards) {
		openCard.classList.remove('open','show');
		openCard.classList.add('match');
	}
	matchCount += 1;

	//Check to see if game is won
	if (matchCount === 8) {
		wonGame();
	}

	openCards = [];
}

//If there is no match, turn cards back over
function noMatch() {
	setTimeout(function() {
		for (let openCard of openCards) {
			openCard.classList.remove('open', 'show');
		}
		openCards = [];
	}, 500);
}

//If the game is won, show the game modal with time elapsed, star rating, and a button to restart the game
function wonGame() {
	
	//Hide game board and show won modal
	const gameElements = document.querySelector('.container');
	setTimeout(function() {
		for (let i = 0; i < gameElements.children.length; i++) {
			if (!gameElements.children[i].classList.contains('won_modal')) {
				gameElements.children[i].classList.add('won_hide');
			} else {
				gameElements.children[i].classList.add('won_display');
			}
		}

		//Show time elapsed and star rating on won modal
		document.querySelector('.won_message_time').innerHTML = `Won in ${moveNumber} moves and ${minElapsed}m ${secElapsed}s`;
		document.querySelector('.won_message_stars').innerHTML = `You earned ${starCount} star(s)`;

		//Show button to restart the game on won modal
		gameElements.querySelector('.button').addEventListener('click', function(event) {
			gameStart();
		})

	}, 600);
}

//Sets the number of stars shown above game board based on the number of moves
function setStars(elem) {
	if (moveNumber >= 0 && moveNumber < 8) {
		elem.children[2].innerHTML = `<i class="fa fa-star"></i>`;
		elem.children[1].innerHTML = `<i class="fa fa-star"></i>`;
		elem.children[0].innerHTML = `<i class="fa fa-star"></i>`;
		starCount = 3;
	} else if (moveNumber >= 8 && moveNumber < 16) {
		elem.children[2].innerHTML = `<i class="fa fa-star-o"></i>`;
		elem.children[1].innerHTML = `<i class="fa fa-star"></i>`;
		elem.children[0].innerHTML = `<i class="fa fa-star"></i>`;
		starCount = 2;
	} else if (moveNumber >= 16) {
		elem.children[2].innerHTML = `<i class="fa fa-star-o"></i>`;
		elem.children[1].innerHTML = `<i class="fa fa-star-o"></i>`;
		elem.children[0].innerHTML = `<i class="fa fa-star"></i>`;
		starCount = 1;
	}
}