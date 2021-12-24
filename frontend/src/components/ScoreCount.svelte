<script lang="ts">
	import { puzzleMachine } from '../store/index';

	const { state } = puzzleMachine;

	const tileCount = $state.context.totalTiles;

	$: completedCount = $state.context.tilesCompleted;
</script>

<h1 class="{completedCount == tileCount ? 'text-secondary' : 'text-white'} font-semibold text-2xl">
	{completedCount}/{tileCount}
</h1>
