import type { PuzzleContext } from '$lib/utils/types';
import type { Updater } from 'svelte/store';

export type PuzzleEvents =
	| { type: 'START'; puzzle: PuzzleContext }
	| { type: 'RESUME' }
	| {
			type: 'ALIGN';
			rowIdx: number;
			colIdx: number;
			moveFn: Updater<number>;
			soft: string | boolean | number;
	  }
	| { type: 'MOVE'; rowIdx: number; colIdx: number }
	| { type: 'MOVE_START'; colIdx: number }
	| { type: 'CHECK' }
	| { type: 'EXIT' };
