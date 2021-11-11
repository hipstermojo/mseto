import type { PuzzleTile } from './types';

export const generatePuzzle = (words: string[]): PuzzleTile[][] =>
	[
		['t', 'u', 'm', 'w'],
		['p', 'a'],
		['a', 'm', 'd', 'k', 'r'],
		['h', 'u', 'n', 'a', 'e'],
		['f', 'h', 'g', 't', 'z'],
		['o', 'i', 'a', 'e']
	].map((col) =>
		col.map((letter) => {
			return { letter, done: false };
		})
	);
