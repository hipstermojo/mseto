import { readable } from 'svelte/store';
import { assign } from 'xstate';
import type { EventObject, StateMachine } from 'xstate';
import { createMachine, interpret } from 'xstate';

import type { Puzzle } from '../utils/types';
import type { PuzzleEvents } from './types';

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
		extra: new Set(['choma', 'cheza', 'umoja', 'chora', 'mwema', 'umiza', 'mwiro'])
	},
	rowPositions: _puzzleCols.reduce((acc: number[], cur) => {
		acc.push(Math.floor(cur.length / 2));
		return acc;
	}, []),
	startedAt: null
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
								for (let i = 0; i < context.cols.length; i++) {
									const column = context.cols[i];
									const pos = context.rowPositions[i];
									const tile = column[pos];
									tile.done = true;
								}
							}
							return context;
						})
					]
				},
				EXIT: { target: 'exit', actions: assign(_stopTimer) },
				COMPLETED: {
					target: 'completed',
					actions: [
						assign(_stopTimer),
						assign((context, _) => {
							context.completed = true;
							return context;
						})
					]
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
