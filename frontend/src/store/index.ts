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
		extra: new Set(['choma', 'cheza', 'umoja', 'chora', 'mwema'])
	},
	rowPositions: _puzzleCols.reduce((acc: number[], cur) => {
		acc.push(Math.floor(cur.length / 2));
		return acc;
	}, []),
	startedAt: null
};

export function useMachine<T, U, V extends EventObject>(machine: StateMachine<T, U, V>) {
	const service = interpret(machine);

	const store = readable(service.initialState, (set) => {
		service.onTransition((state) => {
			set(state);
		});

		service.start();

		return () => {
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
	const elapsed = context.startedAt.getTime() - now.getTime();
	const duration = context.duration + elapsed;
	return { ...context, startedAt: null, duration };
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
					actions: assign((context, _) => {
						// start timer
						return { ...context, startedAt: new Date() };
					})
				}
			}
		},
		running: {
			on: {
				MOVE: [
					{ target: 'completed', cond: (context, event) => false, actions: assign(_stopTimer) },
					{ target: 'running' }
				],
				EXIT: { target: 'exit', actions: assign(_stopTimer) }
			}
		},
		completed: {
			type: 'final'
		},
		exit: {
			type: 'final'
		}
	}
});

export const puzzleMachine = useMachine(_puzzleMachine);
