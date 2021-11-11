<script lang="ts">
	import ArrowBack from '../components/utils/icons/ArrowBack.svelte';
	import GameSummary from '../components/GameSummary.svelte';
	import PuzzleGrid from '../components/PuzzleGrid.svelte';
	import ScoreCount from '../components/ScoreCount.svelte';
	import { puzzleMachine } from '../store/index';

	const { state } = puzzleMachine;
</script>

<svelte:head>
	<meta name="description" content="Daily puzzle for 11-11-2021" />
</svelte:head>

<main class="flex relative flex-col h-screen overflow-hidden justify-center bg-primary">
	<div class="absolute top-0 pt-6 z-10 flex justify-between w-full bg-primary">
		<a href="/" title="back to main page" class="pl-8">
			<ArrowBack />
		</a>
		<div class="pr-8">
			<ScoreCount />
		</div>
		<div class="h-6 absolute -bottom-6 w-full bg-gradient-to-b from-primary to-transparent" />
	</div>
	<PuzzleGrid />
	<div
		class="h-24 absolute bottom-0 w-full bg-gradient-to-t from-primary via-primary to-transparent"
	/>
	{#if $state.context.completed}
		<GameSummary />
	{/if}
</main>
