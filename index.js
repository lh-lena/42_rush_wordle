let grid = document.querySelector('#grid');
let loseContainer = document.getElementById('lose');
let winContainer = document.getElementById('win');
let	rulesWrapper = document.getElementById('rules-wrapper');
let spanWord = document.getElementById('cur-word');

const originalLink = 'https://timo.one/worlde/';
// const curPageUrl = window.location.href;
let generatedURL = originalLink;
let idx = Math.floor(Math.random() * words.length);
let theWord = words[idx];
const rows = 6;
let cols = words[idx].length;
let cursorRow = 0;
let cursorCol = 0;
let	userWin = 0;

document.addEventListener("DOMContentLoaded", () => {
	const fontFace = new FontFace('whatever', 'url("franklin-normal-700.woff2")');

	fontFace.load().then((loadedFontFace) => {
		document.fonts.add(loadedFontFace);
		const style = document.createElement('style');
		style.type = 'text/css';

		const css = `
			@font-face {
				font-family: 'whatever';
				src: url('franklin-normal-700.woff2') format('truetype');
			}
			.box {
				font-family: 'whatever', sans-serif;
				font-size: 2rem;
			}
		`;
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	}).catch((error) => {
		console.error('Failed to load the font:', error)
	});
	createGrid(rows, cols);
	setTheme();
	creatRowExample('example-correct', 'weary', 'correct', 0);
	creatRowExample('example-present', 'pills', 'present', 2);
	creatRowExample('example-absent', 'vague', 'absent', 3);
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
	if (letter)
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

	for (let i = 0; i < rowBoxes.length; ++i)
	{
		let letter = rowBoxes[i].innerText.toLowerCase();
		setLetter(cursorRow, i, letter, 'absent');
		updateKeyboard(letter, 'absent');
	}

	let correctLetters = 0;
	for (let i = 0; i < rowBoxes.length; ++i)
	{
		let letter = rowBoxes[i].innerText.toLowerCase();
		if (letter === theWord[i])
		{
			setLetter(cursorRow, i, letter, 'correct');
			correctLetters++;
			updateKeyboard(letter, 'correct');
			letterFreqs[letter]--;
		}
	}
	if (correctLetters === theWord.length)
	{
		userWin = 1;
		win();
		return;
	}

	for (let i = 0; i < rowBoxes.length; ++i)
	{
		let letter = rowBoxes[i].innerText.toLowerCase();
		if (theWord.includes(letter) && letterFreqs[letter] >= 1)
		{
			setLetter(cursorRow, i, letter, 'present');
			updateKeyboard(letter, 'present');
			letterFreqs[letter]--;
		}
	}
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
	generatedURL += (word ? '&' + encodeURIComponent(word) : '');
	console.log(generatedURL);
	console.log(originalLink);
	reveal();
	if (cursorRow >= rows - 1 && userWin === 0)
	{
		lose();
		return;
	}
	cursorCol = 0;
	cursorRow++;
}

function win() {
	let newParagraph = document.getElementById('description');

	newParagraph.textContent = `You guessed the word ${theWord.toUpperCase()} in ${cursorRow + 1} out of ${rows} tries!`;
	winContainer.style.display = 'block';
	console.log(`Congratulations! You guessed the word in ${cursorRow + 1} out of ${rows} tries!`);
}

function lose() {

	spanWord.textContent = theWord;
	loseContainer.style.display = 'block';
	console.log(`You lost! The word was ${theWord}.`);
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function handleKeyEvent(letter) {
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
	el = keyEvent.srcElement;
	if (!el.classList.contains('key'))
		return;
	let letter = el.innerText.toLowerCase();
	handleKeyEvent(letter);
});

function	shareResult() {
	let	msg = document.getElementById('info-msg');
	msg.textContent = 'Copied results to clipboard';
	msg.style.display = 'block';
	console.log(msg);
	setTimeout(() => {
		msg.style.display = 'none';
	}, 1000);
}

function	restartGame() {
	cursorRow = 0;
	cursorCol = 0;
	userWin = 0;
	idx = Math.floor(Math.random() * words.length);
	theWord = words[idx];
	console.log(theWord);
	loseContainer.style.display = 'none';
	winContainer.style.display = 'none';
	for (let i = 0; i < rows; i++)
		for (let j = 0; j < cols; j++)
			setLetter(i, j, '', 'empty');
	let keys = document.querySelectorAll('.key');
	keys.forEach(key => {
		updateKeyboard(key.textContent, 'default');
	});
}

function creatRowExample(elem, word, style, idx) {
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

let shareBnts = document.querySelectorAll('.share-btn');
for (let i = 0; i < shareBnts.length; i++) {
	shareBnts[i].addEventListener('click', shareResult);
}

let bnts = document.querySelectorAll('.play-again');
for (let i = 0; i < bnts.length; i++) {
	bnts[i].addEventListener('click', restartGame);
}

document.querySelector('.game-rules-icon').addEventListener('click', showRules);
document.querySelector('#cross-container').addEventListener('click', hideRules);
document.querySelector('#cross-lose').addEventListener('click', restartGame);
document.querySelector('#cross-win').addEventListener('click', restartGame);
