export type PuzzleEvents =
	| { type: 'START' }
	| { type: 'MOVE'; rowIdx: number; colIdx: number }
	| { type: 'EXIT' }
	| { type: 'COMPLETED' };
