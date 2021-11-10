<script lang="ts">
	import { puzzleMachine } from '../store/index';

	const { state, send } = puzzleMachine;

	const tileCount = $state.context.cols.reduce((acc, cur) => acc + cur.length, 0);
	// TODO: is there an optimization for this? it currently runs in O(n²) time which is bad
	let completedCount: number;
	$: {
		completedCount = $state.context.cols.reduce(
			(acc, cur) => acc + cur.filter(({ done }) => done).length,
			0
		);
		if (completedCount == tileCount) {
			send('COMPLETED');
		}
	}
</script>

<h1 class="text-white font-semibold text-2xl">{completedCount}/{tileCount}</h1>
