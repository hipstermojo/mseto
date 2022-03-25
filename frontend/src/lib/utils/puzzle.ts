import type { Puzzle, PuzzleTile } from './types';

export const columnsToTiles = (columns: string[][]): PuzzleTile[][] => {
	return columns.map((col) =>
		[...col].map((letter: string) => {
			return { letter, done: false };
		})
	);
};

export const createPuzzle = (
	coreWords: string[] = [],
	extraWords: string[] = [],
	cols: PuzzleTile[][] = []
): Puzzle => {
	const today = new Date();
	return {
		id: today.toDateString(),
		cols,
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
		totalTiles: cols.reduce((acc, cur) => acc + cur.length, 0),
		colIdx: null
	};
};
