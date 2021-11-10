export interface PuzzleTile {
	letter: string;
	done: boolean;
}

export interface Puzzle {
	id: string;
	cols: PuzzleTile[][];
	solutions: { core: Set<string>; extra: Set<string> };
	completed: boolean;
	duration: number;
	rowPositions: number[];
	startedAt: Date | null;
}
