let grid = document.querySelector('#grid');
/* document.body.style.backgroundColor = '#121213'; */

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
				font-weight: 800;
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
letter.style.display = 'flex';
letter.style.alignItems = 'center';
letter.style.justifyContent = 'center';
letter.style.lineHeight = '120%';
letter.style.color = 'white';
letter.innerText = 'Q';
box.appendChild(letter);

let row = document.createElement('div');
row.style.maxWidth = 'fit-content';
row.style.margin = 'auto';

for (let i = 0; i < 5; ++i) {
	let boxClone = box.cloneNode(true);
	boxClone.classList.add('col-' + i.toString());
	row.appendChild(boxClone);
}

for (let i = 0; i < 7; ++i) {
	let rowClone = row.cloneNode(true);
	for (let j = 0; j < rowClone.children.length; ++j) {
		rowClone.children[j].classList.add('row-' + i.toString());
	}
	grid.appendChild(rowClone);
}

function setLetter(row, col, letter, state) {
	let box = document.querySelector('.row-' + row.toString() + '.col-' + col.toString());
	box.querySelector('p').innerText = letter;
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
		box.style.border = '2px solid #565758';
	}
	else
	{
		box.style.backgroundColor = 'transparent';
		box.style.border = '2px solid #565758';
	}
}

setLetter(0, 0, 'W', 'correct');
setLetter(0, 1, 'O', 'correct');
setLetter(0, 2, 'R', 'empty');
setLetter(0, 3, 'D', 'absent');
setLetter(0, 4, 'LE', 'present');
