let grid = document.querySelector('#grid');
let loseContainer = document.getElementById('lose');
let winContainer = document.getElementById('win');
let	rulesWrapper = document.getElementById('rules-wrapper');
let spanWord = document.getElementById('cur-word');

const originalLink = window.location.origin + window.location.pathname;
let generatedURL = originalLink + '?';
let idx = Math.floor(Math.random() * words.length);
let theWord = words[idx];
const rows = 6;
let cols = words[idx].length;
let cursorRow = 0;
let cursorCol = 0;
let	userWin = 0;
let urlWords = [];
let flipDelay = 340;


document.addEventListener("DOMContentLoaded", () => {
	createGrid(rows, cols);
	setTheme();
	createRowExample('example-correct', 'weary', 'correct', 0);
	createRowExample('example-present', 'pills', 'present', 2);
	createRowExample('example-absent', 'vague', 'absent', 3);
});

function createGrid(rows, cols) {
	let grid = document.getElementById('grid');

	for (let i = 0; i < rows; ++i) {
		let row = document.createElement('div');
		row.classList.add('row');

		for (let j = 0; j < cols; ++j) {
			let box = document.createElement('div');
			box.classList.add('box', 'col-' + j.toString(), 'row-' + i.toString(), 'default-cell-bg');
			let letter = document.createElement('p');
			letter.innerHTML = '&nbsp;';
			box.appendChild(letter);
			row.appendChild(box);
		}
		grid.appendChild(row);
	}
}

function setLetter(row, col, letter, state) {
	let box = document.querySelector('.row-' + row.toString() + '.col-' + col.toString());
	if (!letter)
		box.querySelector('p').innerHTML = '&nbsp;';
	else
		box.querySelector('p').innerText = letter.toUpperCase();
	box.classList.remove('absent', 'present', 'correct', 'empty', 'default-cell-bg');
	if (state === 'empty' && !letter)
		box.classList.add('default-cell-bg');
	else
		box.classList.add(state);

	if (letter && box.classList.contains('default-cell-bg'))
	{
		box.style.transform = 'scale(1.1)';
		setTimeout(() => {
			box.style.transform = 'scale(1)';
		}, 100);
	}
}

function backspace() {
	if (cursorCol <= 0)
		return;
	setLetter(cursorRow, cursorCol - 1, '', 'empty');
	cursorCol--;
}

function getFrequencies(string) {
    var freq = {};
    for (var i=0; i<string.length;i++) {
        var character = string.charAt(i);
        if (freq[character]) {
           freq[character]++;
        } else {
           freq[character] = 1;
        }
    }
    return freq;
};

function updateKeyboard(letter, state) {
	let key = document.querySelector('.' + letter);
	if (key)
	{
		key.classList.remove('correct', 'present', 'absent', 'default');
		key.classList.add(state);
	}
}

function reveal() {
	let rowBoxes = document.querySelectorAll('.row-' + cursorRow.toString());
	let letterFreqs = getFrequencies(theWord);
	let letterColor = {};

	for (let i = 0; i < rowBoxes.length; i++)
		letterColor[i] = 'absent';
	for (let i = 0; i < rowBoxes.length; i++)
	{
		let letter = rowBoxes[i].innerText.toLowerCase();
		if (letter === theWord[i])
		{
			letterColor[i] = 'correct';
			letterFreqs[letter]--;
		}
	}
	for (let i = 0; i < rowBoxes.length; i++)
	{
		let letter = rowBoxes[i].innerText.toLowerCase();
		if (theWord.includes(letter) && letterFreqs[letter] >= 1)
		{
			letterColor[i] = 'present';
			letterFreqs[letter]--;
		}
	}
	let correctLetters = 0;
	for (let i = 0; i < rowBoxes.length; i++)
	{
		let letter = rowBoxes[i].innerText.toLowerCase();
		if (letter === theWord[i])
		{
			letterColor[i] = 'correct';
			correctLetters++;
			letterFreqs[letter]--;
		}
	}
	for (let k = 0; k < rowBoxes.length; k++)
	{
			setTimeout(() => {
			let lett = rowBoxes[k].innerText.toLowerCase();
			setLetter(cursorRow, k, lett, letterColor[k]);
			updateKeyboard(lett, letterColor[k]);
		}, (k + 0.1) * flipDelay);
	}
	for (let j = 0; j < rowBoxes.length; j++)
	{
		let delay = j * flipDelay;
		setTimeout(() => {
			rowBoxes[j].style.animation = 'flipX 0.9s';
		}, delay);
		setTimeout(() => {
			rowBoxes[j].style.animation = 'none';
		}, delay + 1000);
	}
	setTimeout(() =>{
		if (correctLetters === theWord.length)
		{
			win();
			return;
		}
		letterColor = {};
	}, flipDelay * cols + 1);
}

function wordError() {
	let rowBoxes = document.querySelectorAll('.row-' + cursorRow.toString());
	let	msg = document.getElementById('info-msg');

	rowBoxes.forEach(box => {
		box.style.animation = 'moveLeftRight 1s infinite';
		setTimeout(() => {
			box.style.animation = 'none';
		}, 500);
	});
	msg.innerHTML = 'Not in word list';
	msg.style.display = 'block';
	setTimeout(() => {
		msg.style.display = 'none';
	}, 1000);
}

function enter() {
	if (cursorCol < cols)
		return;
	let word = '';
	let rowBoxes = document.querySelectorAll('.row-' + cursorRow);
	rowBoxes.forEach(box => {
		word += box.innerText.toLowerCase();
	});
	if (!words.includes(word))
	{
		wordError();
		return;
	}
	generatedURL += (word ? '&' + encodeURIComponent('word') + encodeURIComponent(cursorRow) + '=' + encodeURIComponent(word) : '');
	reveal();
	setTimeout(() => {
		if (cursorRow >= rows - 1 && userWin === 0)
		{
			lose();
			return;
		}
		cursorCol = 0;
		cursorRow++;
	}, flipDelay * cols);
}

function win() {
	userWin = 1;
	if (urlWords[urlWords.length - 1] === theWord)
		return;
	let newParagraph = document.getElementById('description');
	newParagraph.textContent = `You guessed the word ${theWord.toUpperCase()} in ${cursorRow + 1} out of ${rows} tries!`;
	winContainer.style.display = 'block';
	console.log(`Congratulations! You guessed the word in ${cursorRow + 1} out of ${rows} tries!`);
}

function lose() {
	userWin = -1;
	if (urlWords.length === rows)
		return;
	spanWord.textContent = theWord;
	loseContainer.style.display = 'block';
	console.log(`You lost! The word was ${theWord}.`);
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function handleKeyEvent(letter) {
	if (userWin !== 0)
		return;
	if (letter === 'delete' || letter === 'backspace')
	{
		backspace();
		return;
	}
	else if (letter === 'enter')
	{
		enter();
		return;
	}
	if (cursorCol >= cols)
		return;
	setLetter(cursorRow, cursorCol, letter, 'empty');
	cursorCol++;
}

function isSpecialKey(letter) {
	if (letter === 'enter' || letter === 'backspace')
		return true;
	return false;
}

setTimeout(() => {
	document.addEventListener("keyup", (keyEvent) => {
		let letter = keyEvent.key.toLowerCase();
		if (!isLetter(letter) && !isSpecialKey(letter))
			return;
		handleKeyEvent(letter);
	});
}, 500);

document.addEventListener("click", (keyEvent) => {
	keyEvent.preventDefault();
	keyEvent.target.blur();
	el = keyEvent.srcElement;
	if (!el.classList.contains('key'))
		return;
	let letter = el.innerText.toLowerCase();
	handleKeyEvent(letter);
});

function	shareResult() {
	let	msg = document.getElementById('info-msg');
	generatedURL += '&theWord=' + encodeURIComponent(theWord);
	navigator.clipboard.writeText(generatedURL.replace('/?&', '/?'));
	msg.textContent = 'Copied results to clipboard';
	msg.style.display = 'block';
	setTimeout(() => {
		msg.style.display = 'none';
	}, 1000);
}

function	restartGame() {
	cursorRow = 0;
	cursorCol = 0;
	userWin = 0;
	urlWords = [];
	generatedURL = originalLink + '?';
	idx = Math.floor(Math.random() * words.length);
	theWord = words[idx];
	loseContainer.style.display = 'none';
	winContainer.style.displaey = 'none';
	for (let i = 0; i < rows; i++)
		for (let j = 0; j < cols; j++)
			setLetter(i, j, '', 'empty');
	let keys = document.querySelectorAll('.key');
	keys.forEach(key => {
		updateKeyboard(key.textContent, 'default');
	});
	window.history.pushState('restart', document.title, window.location.pathname);
	handleParams();
}

function	createLetterExample(style, letter)
{
	let	el = document.getElementById('example-let-' + style);
	el.textContent = letter.toUpperCase();
}

function createRowExample(elem, word, style, idx) {
	let node = document.getElementById(elem);
	let row = document.createElement('div');
	row.classList.add('row');

	for (let j = 0; j < cols; ++j) {
		let box = document.createElement('div');
		box.classList.add('box', 'col-' + j.toString(), 'row', 'empty');
		let letter = document.createElement('p');
		letter.innerHTML = word[j].toUpperCase();
		if (j === idx) {
			box.classList.remove('empty');
			box.classList.add(style);
			createLetterExample(style, word[j]);
		}
		box.appendChild(letter);
		row.appendChild(box);
	}
	node.appendChild(row);
}

function showRules() {
	rulesWrapper.style.display = 'block';
}

function hideRules() {
	rulesWrapper.style.display = 'none';
}

document.addEventListener('keyup', function(event) {
	if (event.key === 'Escape')
		hideRules();
});

function	setTheme()
{
	const root = document.documentElement;
	const themeToggleButton = document.getElementById('theme-toggle');
	const newTheme = root.className === 'dark' ? 'light' : 'dark';
	root.className = newTheme;
	document.querySelector('.theme-name').textContent = newTheme;
	themeToggleButton.innerHTML = newTheme === 'dark' ? '🔆' : '🌙';
}

document.getElementById('theme-toggle').addEventListener('click', function(event) {
	event.preventDefault();
	event.target.blur();
	setTheme();
});

let btnPlay = document.getElementById('play-icon');

btnPlay.addEventListener('click', function(event) {
	event.preventDefault();
	event.target.blur();
	restartGame();
	btnPlay.style.display = 'none';
});

let shareBnts = document.querySelectorAll('.share-btn');
for (let i = 0; i < shareBnts.length; i++) {
	shareBnts[i].addEventListener('click', shareResult);
}

let bnts = document.querySelectorAll('.play-again');
for (let i = 0; i < bnts.length; i++) {
	bnts[i].addEventListener('click', restartGame);
}

let dictionaryBtn = document.getElementById('btn-dictionary');
dictionaryBtn.addEventListener('click', (e) => {
	e.preventDefault();
	e.target.blur();
	let linkUrl = `https://www.thefreedictionary.com/${theWord}`;
	window.open(linkUrl, '_blank');
});


document.querySelector('.game-rules-icon').addEventListener('click', showRules);
document.querySelector('#cross-container').addEventListener('click', hideRules);
document.querySelector('#cross-lose').addEventListener('click', restartGame);
document.querySelector('#cross-win').addEventListener('click', () => {
	winContainer.style.display = 'none';
	restartGame();
});

function	showPlayBtn() {
	let btn = document.getElementById('play-icon');
	btn.style.display = 'block';
}

function animateWords(lines) {
	let delay = 0;

	lines.forEach(line => {
			[...line].forEach(letter => {
				setTimeout(() => {
					handleKeyEvent(letter.toLowerCase());
				}, delay += 200);
			});
			setTimeout(() => {
				handleKeyEvent('enter');
			}, delay += 300);
			delay += (flipDelay * cols + 1);
	});
	showPlayBtn();
}

function getWordsFromParams(urlParams) {
	let tmpWords = [];

	for (let i = 0; i < rows; ++i) {
		let word = urlParams.get('word' + i.toString());
		if (word !== null && word.length === cols && words.includes(word))
			tmpWords.push(word)
		else
			break
	}
	return tmpWords;
}

function handleParams() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	urlWords = getWordsFromParams(urlParams);
	const forceWord = urlParams.get('theWord');
	if (forceWord !== null && words.includes(forceWord)) {
		theWord = forceWord;
	}

	if (urlWords.length > 0)
		animateWords(urlWords);
}

handleParams();
