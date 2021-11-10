<script lang="ts">
	import { onMount } from 'svelte';

	import { puzzleMachine } from '../store/index';

	import PuzzleColumn from './PuzzleColumn.svelte';

	const { state, send } = puzzleMachine;

	onMount(() => {
		send('START');
	});
</script>

<div class="flex justify-center relative h-12 overflow-visible">
	<div class="absolute w-full bg-white h-12 bg-opacity-30" />
	{#each $state.context.cols as col, i}
		<PuzzleColumn index={i} tiles={col} />
	{/each}
</div>
