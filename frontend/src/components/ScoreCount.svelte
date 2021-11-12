<script lang="ts">
	import { puzzleMachine } from '../store/index';

	const { state, send } = puzzleMachine;

	const tileCount = $state.context.cols.reduce((acc, cur) => acc + cur.length, 0);

	$: completedCount = $state.context.tilesCompleted;
	$: {
		if (completedCount == tileCount) {
			send('COMPLETED');
		}
	}
</script>

<h1 class="{completedCount == tileCount ? 'text-secondary' : 'text-white'} font-semibold text-2xl">
	{completedCount}/{tileCount}
</h1>
