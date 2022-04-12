<script lang="ts">
	import { puzzleMachine } from '$lib/store';

	const { state, send } = puzzleMachine;

	const getUnsolved = (): string[] => {
		const coreWords = $state.context.solutions.core;
		const foundWords = $state.context.foundWords;
		return [...coreWords].filter((word) => !foundWords.has(word));
	};

	const hammingDistances = (displayWord: number[], targetWord: number[]): number[] => {
		return displayWord.map((tilePos, index) => tilePos - targetWord[index]);
	};

	const getRowPositions = (targetWord: string): number[] => {
		const { tiles } = $state.context;
		const positions: number[] = [];
		for (let colIdx = 0; colIdx < tiles.length; colIdx++) {
			const column = tiles[colIdx];
			for (let i = 0; i < column.length; i++) {
				const { letter } = column[i];
				if (targetWord[colIdx] == letter) {
					positions.push(i);
				}
			}
		}
		return positions;
	};

	const solveWord = () => {
		if ($state.matches('completed')) {
			return;
		}
		const unsolved = getUnsolved();
		const unsolvedPositions = unsolved.map((word) => getRowPositions(word));
		const firstSolution = unsolvedPositions
			.map((positions, idx) => {
				const dist = hammingDistances($state.context.rowPositions, positions).reduce(
					(acc, cur) => acc + Math.abs(cur),
					0
				);
				return [dist, idx];
			})
			.sort(([distA, _], [distB, __]) => {
				return distA - distB;
			})
			.map(([_, idx]) => idx)[0];

		const targetWordPositions = unsolvedPositions[firstSolution];

		for (let colIdx = 0; colIdx < targetWordPositions.length; colIdx++) {
			const pos = targetWordPositions[colIdx];
			const rowPos = $state.context.rowPositions[colIdx];

			if (pos != rowPos) {
				send('ALIGN', {
					rowIdx: pos,
					colIdx,
					moveFn: (curY: number) => curY + 52 * (rowPos - pos),
					soft: true
				});
			}
		}
		send('CHECK');
	};
</script>

<button on:click={() => solveWord()} class="bg-white mt-2 py-2 px-4 uppercase">
	Tap for a hint
</button>
