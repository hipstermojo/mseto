import type { PuzzleTile } from './types';

export const generatePuzzle = (words: string[]): PuzzleTile[][] => {
	let columns = words.reduce((result: Set<string>[], word) => {
		for (let i = 0; i < word.length; i++) {
			const letter = word[i];
			if (result[i]) {
				result[i].add(letter);
			} else {
				result.push(new Set([letter]));
			}
		}
		return result;
	}, []);

	return columns.map((col) =>
		shuffle([...col]).map((letter: string) => {
			return { letter, done: false };
		})
	);
};

function shuffle(letters: string[]): string[] {
	// Obtained from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	let currentIndex = letters.length,
		randomIndex: number;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[letters[currentIndex], letters[randomIndex]] = [letters[randomIndex], letters[currentIndex]];
	}

	return letters;
}
