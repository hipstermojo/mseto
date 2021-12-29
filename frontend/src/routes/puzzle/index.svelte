<script lang="ts" context="module">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	import { columnsToTiles } from '$lib/utils/puzzle';

	export async function load({ fetch, page }: LoadInput): Promise<LoadOutput> {
		let id = page.query.get('id');

		const statusMsg = {
			503: 'Unable to reach server',
			422: 'Invalid request made to server',
			404: 'Requested puzzle does not exist'
		};
		if (!id) {
			const url = '/api/packs/daily.json';
			const res = await fetch(url);

			if (res.ok) {
				const { id: puzzleID } = await res.json();
				id = puzzleID;
			} else {
				if (statusMsg[res.status]) {
					return { status: res.status, error: statusMsg[res.status] };
				}
				return { status: res.status };
			}
		}

		const url = `/api/puzzles.json?id=${id}`;
		const res = await fetch(url);

		if (res.ok) {
			const data = await res.json();

			return {
				props: { data: { ...data, cols: columnsToTiles(data.cols) } }
			};
		}

		if (statusMsg[res.status]) {
			return { status: res.status, error: statusMsg[res.status] };
		}
		return { status: res.status };
	}
</script>

<script lang="ts">
	import IconSet from '$lib/components/utils/icons/IconSet.svelte';
	import GameSummary from '$lib/components/GameSummary.svelte';
	import PuzzleGrid from '$lib/components/PuzzleGrid.svelte';
	import ScoreCount from '$lib/components/ScoreCount.svelte';

	import { puzzleMachine } from '$lib/store/index';
	import { createPuzzle } from '$lib/utils/puzzle';
	import type { PuzzleTile } from '$lib/utils/types';

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
