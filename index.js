const fs = require('fs');
const path = require('path');

// game field size
const MAX_X = 6;

// msec
const TIMER = 500;

class TheGame {
	state = [];
	generations = -1;
	index = 0;

	constructor() {
		const [ inputPath, generations ] = process.argv.slice(2);

		this.generations = parseInt(generations);

		this.generateEmptyState(MAX_X);
		this.readState(inputPath);
	}

	generateEmptyState(size) {
		this.state = new Array(size).fill(0);
	}

	readState(inputPath) {
		try {
			this.state = fs.readFileSync(path.join(__dirname, inputPath)).toString().trim().split('').map(it => parseInt(it));
		} catch (e) {
			console.log('Error while reading the input.', e);
		}
	}

	getAliveNeighboursCount(index) {
		const neighbours = [];

		const row = Math.floor(index / MAX_X);
		const col = index % MAX_X;

		// left
		if (col !== 0) 
			neighbours.push(this.state[index - 1]);

		// right
		if (col !== MAX_X - 1) 
			neighbours.push(this.state[index + 1]);

		// top
		if (row !== 0)
			neighbours.push(this.state[index - MAX_X]);			

		// bottom
		if (row !== MAX_X - 1)
			neighbours.push(this.state[index + MAX_X]);		

		// top left
		if (col !== 0 && row !== 0)
			neighbours.push(this.state[index - MAX_X - 1]);					

		// top right
		if (col !== 0 && row !== MAX_X - 1)
			neighbours.push(this.state[index - MAX_X + 1]);					

		// bottom left
		if (col !== 0 && row !== MAX_X - 1)
			neighbours.push(this.state[index + MAX_X - 1]);					

		// bottom right
		if (col !== MAX_X - 1 && row !== MAX_X - 1)
			neighbours.push(this.state[index + MAX_X + 1]);			

		return neighbours.filter(Boolean).length;
	}

	generation() {
		const newState = this.state.slice();

		this.state.forEach((cell, index) => {
			const nearAliveCount = this.getAliveNeighboursCount(index);

			if (cell && (nearAliveCount === 2 || nearAliveCount === 3))
				return newState[index] = 1;
			else if (nearAliveCount === 3) 
				return newState[index] = 1;
			else 
				return newState[index] = 0;				
		});

		this.state = newState;
		this.index++;
	}

	play() {
		const interval = setInterval(() => {
			if (this.index >= this.generations)
				clearInterval(interval);

			this.generation();
			this.output();
		}, TIMER);
	}

	output() {
		console.clear();
		console.log(`Generation #${this.index}:`);

		for (let i = 0; i < MAX_X; i++) {
			for (let j = 0; j < MAX_X; j++) {
				process.stdout.write(`${this.state[MAX_X * i + j]} `);
			}

			console.log();
		}
	}
}

new TheGame().play();
