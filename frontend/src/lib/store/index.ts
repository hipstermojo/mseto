import { writable, type Writable } from 'svelte/store';
import { assign } from 'xstate';
import type { EventObject, StateMachine } from 'xstate';
import { createMachine, interpret } from 'xstate';

import type { PuzzleContext } from '$lib/utils/types';
import { createPuzzle } from '$lib/utils/puzzle';

import type { PuzzleEvents } from './types';
import type { BloomFilter } from 'bloom-filters';

let prevState = null;

function useMachine<T, U, V extends EventObject>(machine: StateMachine<T, U, V>) {
	const service = interpret(machine);

	const store = writable(service.initialState, (set) => {
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

const _stopTimer = (context: PuzzleContext, event: PuzzleEvents) => {
	const now = new Date();
	const elapsed = Math.floor((now.getTime() - context.startedAt.getTime()) / 1000);
	const duration = context.duration + elapsed;
	return { ...context, startedAt: null, duration };
};

const _startTimer = (context: PuzzleContext, event: PuzzleEvents) => {
	return { ...context, startedAt: new Date() };
};

const _isPuzzleComplete = (context: PuzzleContext, event: PuzzleEvents) =>
	context.tilesCompleted == context.totalTiles;

const _puzzleMachine = createMachine<PuzzleContext, PuzzleEvents>({
	id: 'puzzle',
	initial: 'initial',
	context: createPuzzle(),
	states: {
		initial: {
			on: {
				RESUME: {
					target: 'running',
					actions: assign(_startTimer)
				},
				START: {
					target: 'running',
					actions: [assign((_, { puzzle }) => puzzle), assign(_startTimer)]
				}
			}
		},
		running: {
			on: {
				MOVE_START: {
					target: 'running',
					actions: assign((context, { colIdx }) => {
						context.colIdx = colIdx;
						return context;
					})
				},
				MOVE: {
					target: 'running',
					actions: assign((context, { colIdx, rowIdx }) => {
						context.rowPositions[colIdx] = rowIdx;
						return context;
					})
				},
				CHECK: {
					target: 'checkIfCompleted',
					actions: assign((context, _) => {
						let word = context.tiles.reduce((acc, cur, idx) => {
							const pos = context.rowPositions[idx];
							return acc + cur[pos].letter;
						}, '');
						if (context.wordList.has(word)) {
							context.foundWords.add(word);
							if (!context.solutions.core.has(word)) {
								context.solutions.extra.add(word);
							}

							context.wordExists = true;
							for (let i = 0; i < context.tiles.length; i++) {
								const column = context.tiles[i];
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
				},
				EXIT: { target: 'exit', actions: assign(_stopTimer) }
			}
		},
		checkIfCompleted: {
			always: [
				{ target: 'completed', cond: _isPuzzleComplete, actions: assign(_stopTimer) },
				{ target: 'running' }
			]
		},
		completed: {
			type: 'final'
		},
		exit: {
			on: { RESUME: { target: 'running', actions: assign(_startTimer) } }
		}
	}
});

export const puzzleMachine = useMachine(_puzzleMachine);

// This should not be read from directly. It is instead to be used to cache the deserialized bloom filter
export const bloomFilter: Writable<BloomFilter> = writable(null);
