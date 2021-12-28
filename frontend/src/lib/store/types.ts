import type { Puzzle } from '$lib/utils/types';

export type PuzzleEvents =
	| { type: 'START'; puzzle: Puzzle }
	| { type: 'RESUME' }
	| { type: 'MOVE'; rowIdx: number; colIdx: number }
	| { type: 'EXIT' };
