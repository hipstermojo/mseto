import type { BloomFilter } from 'bloom-filters';
import type { Spring } from 'svelte/motion';

export interface PuzzleTile {
	letter: string;
	done: boolean;
}

export interface PuzzleContext {
	id: string;
	tiles: PuzzleTile[][];
	solutions: { core: Set<string>; extra: Set<string> };
	wordExists: boolean;
	foundWords: Set<string>;
	totalTiles: number;
	tilesCompleted: number;
	duration: number;
	rowPositions: number[];
	startedAt: Date | null;
	colIdx: number | null;
	wordList: BloomFilter;
	columnSprings: Spring<number>[];
}
