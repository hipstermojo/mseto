<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { puzzleMachine } from '$lib/store/index';

	import PuzzleColumn from './PuzzleColumn.svelte';

	const { state, send } = puzzleMachine;

	onMount(() => {
		if (!($state.matches('completed') || $state.matches('running'))) {
			send('RESUME');
		}
	});

	onDestroy(() => {
		if (!$state.matches('completed')) {
			send('EXIT');
		}
	});
</script>

<div class="flex justify-center relative h-12 overflow-visible">
	<div class="absolute w-full bg-white h-12 bg-opacity-30" />
	{#each $state.context.tiles as col, i}
		<PuzzleColumn index={i} tiles={col} />
	{/each}
</div>
