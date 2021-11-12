import { readable } from 'svelte/store';
import { assign } from 'xstate';
import type { EventObject, StateMachine } from 'xstate';
import { createMachine, interpret } from 'xstate';

import type { Puzzle } from '../utils/types';
import { generatePuzzle } from '../utils/puzzle';

import type { PuzzleEvents } from './types';

const words = ['tamaa', 'ndani', 'neema', 'dunia', 'kesho', 'mvuke'];

// const _puzzleCols = generatePuzzle(words);
const _puzzleCols = [
	[
		{ letter: 'k', done: false },
		{ letter: 't', done: false },
		{ letter: 'm', done: false },
		{ letter: 'd', done: false },
		{ letter: 'n', done: false }
	],
	[
		{ letter: 'e', done: false },
		{ letter: 'v', done: false },
		{ letter: 'd', done: false },
		{ letter: 'a', done: false },
		{ letter: 'u', done: false }
	],
	[
		{ letter: 'n', done: false },
		{ letter: 'm', done: false },
		{ letter: 'a', done: false },
		{ letter: 'u', done: false },
		{ letter: 's', done: false },
		{ letter: 'e', done: false }
	],
	[
		{ letter: 'k', done: false },
		{ letter: 'a', done: false },
		{ letter: 'h', done: false },
		{ letter: 'm', done: false },
		{ letter: 'n', done: false },
		{ letter: 'i', done: false }
	],
	[
		{ letter: 'i', done: false },
		{ letter: 'o', done: false },
		{ letter: 'e', done: false },
		{ letter: 'a', done: false }
	]
];

const _dailyPuzzle: Puzzle = {
	id: '12-11-2021',
	cols: _puzzleCols,
	duration: 0,
	solutions: {
		core: new Set(words),
		extra: new Set([
			'ndama',
			'ndume',
			'ndumo',
			'nduni',
			'nauni',
			'nasia',
			'nusia',
			'ndeme',
			'nunia',
			'nusia',
			'nauni',
			'namna',
			'kemia',
			'kania',
			'kesha',
			'kauka',
			'kasha',
			'kasma',
			'kasia',
			'kunia',
			'kuuni',
			'deuka',
			'deski',
			'desia',
			'dumaa',
			'dumia',
			'mesha',
			'mvuko',
			'mvumo',
			'mdeke',
			'mdeni',
			'mamia',
			'maana',
			'mauko',
			'maume',
			'masia',
			'teuka',
			'tania',
			'tamka',
			'tamko',
			'tamia',
			'tauni',
			'tasia',
			'tunia',
			'tumia',
			'tuama',
			'tusia'
		])
	},
	foundWords: new Set(),
	rowPositions: _puzzleCols.reduce((acc: number[], cur) => {
		acc.push(Math.floor(cur.length / 2));
		return acc;
	}, []),
	startedAt: null,
	wordExists: false,
	tilesCompleted: 0
};

let prevState = null;

export function useMachine<T, U, V extends EventObject>(machine: StateMachine<T, U, V>) {
	const service = interpret(machine);

	const store = readable(service.initialState, (set) => {
		service.onTransition((state) => {
			set(state);
		});

		if (prevState) {
			service.start(prevState);
		} else {
			service.start();
		}

		return () => {
			prevState = service.state;
			service.stop();
		};
	});

	return {
		state: store,
		send: service.send
	};
}

const _stopTimer = (context: Puzzle, event: PuzzleEvents) => {
	const now = new Date();
	const elapsed = Math.floor((now.getTime() - context.startedAt.getTime()) / 1000);
	const duration = context.duration + elapsed;
	return { ...context, startedAt: null, duration };
};

const _startTimer = (context: Puzzle, event: PuzzleEvents) => {
	return { ...context, startedAt: new Date() };
};

const _puzzleMachine = createMachine<Puzzle, PuzzleEvents>({
	id: 'puzzle',
	initial: 'initial',
	context: _dailyPuzzle,
	states: {
		initial: {
			on: {
				START: {
					target: 'running',
					actions: assign(_startTimer)
				}
			}
		},
		running: {
			on: {
				MOVE: {
					target: 'running',
					actions: [
						assign((context, { colIdx, rowIdx }) => {
							context.rowPositions[colIdx] = rowIdx;
							return context;
						}),
						assign((context, _) => {
							let word = context.cols.reduce((acc, cur, idx) => {
								const pos = context.rowPositions[idx];
								return acc + cur[pos].letter;
							}, '');
							if (context.solutions.core.has(word) || context.solutions.extra.has(word)) {
								context.foundWords.add(word);

								context.wordExists = true;
								for (let i = 0; i < context.cols.length; i++) {
									const column = context.cols[i];
									const pos = context.rowPositions[i];
									const tile = column[pos];
									if (!tile.done) {
										context.tilesCompleted++;
										tile.done = true;
									}
								}
							} else {
								context.wordExists = false;
							}
							return context;
						})
					]
				},
				EXIT: { target: 'exit', actions: assign(_stopTimer) },
				COMPLETED: {
					target: 'completed',
					actions: assign(_stopTimer)
				}
			}
		},
		completed: {
			type: 'final'
		},
		exit: {
			on: { START: { target: 'running', actions: assign(_startTimer) } }
		}
	}
});

export const puzzleMachine = useMachine(_puzzleMachine);
