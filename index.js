let grid = document.querySelector('#grid');

const idx = Math.floor(Math.random() * words.length);
const theWord = words[idx];
const rows = 6;
const cols = theWord.length;
let cursorRow = 0;
let cursorCol = 0;

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
});

let box = document.createElement('div');
box.style.width = '60px';
box.style.height = '60px';
box.style.backgroundColor = 'transparent';
box.style.border = '2px solid #3a3a3c';
box.style.display = 'inline-block';
box.style.margin = '2px';
box.classList.add('box');

let letter = document.createElement('p');
letter.style.background = 'none';
letter.style.display = 'flex';
letter.style.alignItems = 'center';
letter.style.justifyContent = 'center';
letter.style.lineHeight = '10%';
letter.style.color = 'white';
letter.innerHTML = '&nbsp;';
box.appendChild(letter);

let row = document.createElement('div');
row.style.maxWidth = 'fit-content';
row.style.margin = 'auto';

for (let i = 0; i < cols; ++i) {
	let boxClone = box.cloneNode(true);
	boxClone.classList.add('col-' + i.toString());
	row.appendChild(boxClone);
}

for (let i = 0; i < rows; ++i) {
	let rowClone = row.cloneNode(true);
	for (let j = 0; j < rowClone.children.length; ++j) {
		rowClone.children[j].classList.add('row-' + i.toString());
	}
	grid.appendChild(rowClone);
}

function setLetter(row, col, letter, state) {
	let box = document.querySelector('.row-' + row.toString() + '.col-' + col.toString());
	if (!letter)
		box.querySelector('p').innerHTML = '&nbsp;';
	else
		box.querySelector('p').innerText = letter.toUpperCase();
	if (state === 'absent')
	{
		box.style.backgroundColor = '#3a3a3c';
		box.style.border = '2px solid #3a3a3c';
	}
	else if (state === 'present')
	{
		box.style.backgroundColor = '#b59f3b';
		box.style.border = '2px solid #b59f3b';
	}
	else if (state === 'correct')
	{
		box.style.backgroundColor = '#538d4e';
		box.style.border = '2px solid #538d4e';
	}
	else if (state === 'empty')
	{
		box.style.backgroundColor = 'transparent';
		if (letter)
			box.style.border = '2px solid #565758';
		else
			box.style.border = '2px solid #3a3a3c';
	}
	else
	{
		box.style.backgroundColor = 'red';
		box.style.border = '2px solid #565758';
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
	
	if (state === 'absent')
		key.style.backgroundColor = '#3a3a3c';
	else if (state === 'present')
		key.style.backgroundColor = '#b59f3b';
	else if (state === 'correct')
		key.style.backgroundColor = '#538d4e';
}

function win() {
	console.log(`Congratulations! You guessed the word in ${cursorRow + 1} out of ${rows} tries!`);
}

function lose() {
	console.log(`You lost! The word was ${theWord}.`);
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
		win()
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
		console.log('Not in word list!');
		return;
	}
	reveal();
	if (cursorRow >= rows - 1)
	{
		lose();
		return;
	}
	cursorCol = 0;
	cursorRow++;
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
