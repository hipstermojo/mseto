import type { Puzzle, PuzzleTile } from './types';

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

export const extraWords = [
	'ndama',
	'ndume',
	'ndumo',
	'nduni',
	'nauni',
	'nasia',
	'nusia',
	'ndeme',
	'nunia',
	'nusia',
	'nauni',
	'namna',
	'kemia',
	'kania',
	'kesha',
	'kauka',
	'kasha',
	'kasma',
	'kasia',
	'kunia',
	'kuuni',
	'deuka',
	'deski',
	'desia',
	'dumaa',
	'dumia',
	'mesha',
	'mvuko',
	'mvumo',
	'mdeke',
	'mdeni',
	'mamia',
	'maana',
	'mauko',
	'maume',
	'masia',
	'teuka',
	'tania',
	'tamka',
	'tamko',
	'tamia',
	'tauni',
	'tasia',
	'tunia',
	'tumia',
	'tuama',
	'tusia'
];

export const createPuzzle = (
	coreWords: string[] = [],
	extraWords: string[] = [],
	cols: string[][] = []
): Puzzle => {
	const today = new Date();
	return {
		id: today.toDateString(),
		cols: cols.map((col) => col.map((letter) => ({ letter, done: false }))),
		duration: 0,
		solutions: {
			core: new Set(coreWords),
			extra: new Set(extraWords)
		},
		foundWords: new Set(),
		rowPositions: cols.reduce((acc: number[], cur) => {
			acc.push(Math.floor(cur.length / 2));
			return acc;
		}, []),
		startedAt: null,
		wordExists: false,
		tilesCompleted: 0,
		totalTiles: cols.reduce((acc, cur) => acc + cur.length, 0)
	};
};
