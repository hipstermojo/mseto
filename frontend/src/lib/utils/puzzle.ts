import type { PuzzleContext, PuzzleTile } from './types';

import fastCartesian from 'fast-cartesian';
import type { BloomFilter } from 'bloom-filters';

export const columnsToTiles = (columns: string[][]): PuzzleTile[][] => {
	return columns.map((col) =>
		[...col].map((letter: string) => {
			return { letter, done: false };
		})
	);
};

export const shuffleCols = (columns: string[][], filter: BloomFilter): string[][] => {
	const shuffle = (column: string[]): string[] => {
		for (let i = column.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[column[i], column[j]] = [column[j], column[i]];
		}
		return column;
	};

	let isBadlyShuffled = true;
	while (isBadlyShuffled) {
		for (let i = 0; i < columns.length; i++) {
			columns[i] = shuffle(columns[i]);
		}

		const word = columns.reduce((acc, column) => {
			const mid = Math.floor(column.length / 2);
			return acc + column[mid];
		}, '');
		isBadlyShuffled = filter.has(word);
	}
	return columns;
};

export const wordsToCols = (words: string[]): string[][] => {
	const cols: Set<string>[] = Array.from({ length: words[0].length }, () => new Set());
	for (const row of words) {
		for (let colIdx = 0; colIdx < row.length; colIdx++) {
			cols[colIdx].add(row[colIdx]);
		}
	}
	return cols.map((col) => [...col]);
};

export const allPossibleWordsFromCols = (columns: string[][]): string[] => {
	return fastCartesian(columns).reduce((acc, cur) => {
		acc.push(cur.join(''));
		return acc;
	}, []);
};

export const createPuzzle = (
	coreWords: string[] = [],
	wordList: BloomFilter = null,
	tiles: PuzzleTile[][] = []
): PuzzleContext => {
	const today = new Date();
	return {
		id: today.toDateString(),
		tiles,
		duration: 0,
		solutions: {
			core: new Set(coreWords),
			extra: new Set()
		},
		foundWords: new Set(),
		rowPositions: tiles.reduce((acc: number[], cur) => {
			acc.push(Math.floor(cur.length / 2));
			return acc;
		}, []),
		startedAt: null,
		wordExists: false,
		tilesCompleted: 0,
		totalTiles: tiles.reduce((acc, cur) => acc + cur.length, 0),
		colIdx: null,
		wordList
	};
};
