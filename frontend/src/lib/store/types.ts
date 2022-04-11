import type { PuzzleContext } from '$lib/utils/types';

export type PuzzleEvents =
	| { type: 'START'; puzzle: PuzzleContext }
	| { type: 'RESUME' }
	| { type: 'MOVE'; rowIdx: number; colIdx: number }
	| { type: 'MOVE_START'; colIdx: number }
	| { type: 'CHECK' }
	| { type: 'EXIT' };
