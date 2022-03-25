export interface PuzzleTile {
	letter: string;
	done: boolean;
}

export interface Puzzle {
	id: string;
	cols: PuzzleTile[][];
	solutions: { core: Set<string>; extra: Set<string> };
	wordExists: boolean;
	foundWords: Set<string>;
	totalTiles: number;
	tilesCompleted: number;
	duration: number;
	rowPositions: number[];
	startedAt: Date | null;
	colIdx: number | null;
}
