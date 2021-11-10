import { readable } from 'svelte/store';
import type { Puzzle } from './utils/types';

const words = ['chama', 'ziara', 'uwezo', 'shida', 'mmoja'];

const _puzzleCols = [
	['c', 'z', 'u', 's', 'm'],
	['h', 'i', 'w', 'm'],
	['a', 'e', 'i', 'o'],
	['m', 'r', 'z', 'd', 'j'],
	['a', 'o']
].map((col) =>
	col.map((letter) => {
		return { letter, done: false };
	})
);

const _dailyPuzzle: Puzzle = {
	id: '10-11-2021',
	cols: _puzzleCols,
	completed: false,
	duration: 0,
	solutions: {
		core: new Set(words),
		extra: new Set(['choma', 'cheza', 'umoja', 'chora', 'mwema'])
	},
	rowPositions: _puzzleCols.reduce((acc: number[], cur) => {
		acc.push(Math.floor(cur.length / 2));
		return acc;
	}, [])
};

export const dailyPuzzle = readable(_dailyPuzzle, (_) => {
	return () => {};
});
