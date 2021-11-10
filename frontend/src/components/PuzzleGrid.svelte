<script lang="ts">
	import { dailyPuzzle } from '../store';

	import PuzzleColumn from './PuzzleColumn.svelte';
</script>

<div class="flex justify-center relative h-12 overflow-visible">
	<div class="absolute w-full bg-white h-12 bg-opacity-30" />
	{#each $dailyPuzzle.cols as col, i}
		<PuzzleColumn index={i} tiles={col} />
	{/each}
</div>
