<script lang="ts" context="module">
	import { columnsToTiles } from '../utils/puzzle';

	export async function load({ fetch }) {
		const url = '/api/puzzles.json';
		const res = await fetch(url);

		if (res.ok) {
			const data = await res.json();

			return {
				props: { data: { ...data, cols: columnsToTiles(data.cols) } }
			};
		}
		// TODO: Add error handling

		const core = [];
		const extra = [];

		const cols = columnsToTiles([]);

		return {
			status: 200,
			props: {
				data: {
					core,
					extra,
					cols
				}
			}
		};
	}
</script>

<script lang="ts">
	import IconSet from '../components/utils/icons/IconSet.svelte';
	import GameSummary from '../components/GameSummary.svelte';
	import PuzzleGrid from '../components/PuzzleGrid.svelte';
	import ScoreCount from '../components/ScoreCount.svelte';

	import { puzzleMachine } from '../store/index';
	import { createPuzzle } from '../utils/puzzle';
	import type { PuzzleTile } from '../utils/types';

	export let data: { core: string[]; extra: string[]; cols: PuzzleTile[][] };

	const { state, send } = puzzleMachine;
	const today = new Date().toDateString();

	if ($state.context.totalTiles == 0) {
		const puzzle = createPuzzle(data.core, data.extra, data.cols);
		send('START', { puzzle });
	}
</script>

<svelte:head>
	<meta name="description" content="Daily puzzle for {today}" />
</svelte:head>

<main class="flex relative flex-col h-screen overflow-hidden justify-center bg-primary">
	<div class="absolute top-0 pt-6 z-10 flex justify-between w-full bg-primary">
		<a href="/" title="back to main page" class="pl-8">
			<IconSet type="arrow-back" />
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
	{#if $state.matches('completed')}
		<GameSummary />
	{/if}
</main>
