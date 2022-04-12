<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';

	export const load: Load = async ({ props }) => {
		const { words, error } = props;

		if (error) {
			return { status: 400, error };
		}

		if (browser) {
			let b_filter = localStorage.getItem(BLOOM_FILTER_KEY);
			if (!b_filter) {
				const res = await fetch('/b_filter.json');
				if (res.ok) {
					b_filter = await res.text();
					localStorage.setItem(BLOOM_FILTER_KEY, b_filter);
				}
			}
		}
		return { status: 200, props: { words } };
	};
</script>

<script lang="ts">
	import type { Writable } from 'svelte/store';
	import BloomFilter from 'bloom-filters/dist/bloom/bloom-filter.js';

	import IconSet from '$lib/components/utils/icons/IconSet.svelte';
	import GameSummary from '$lib/components/GameSummary.svelte';
	import PuzzleGrid from '$lib/components/PuzzleGrid.svelte';
	import ScoreCount from '$lib/components/ScoreCount.svelte';

	import { puzzleMachine, bloomFilter } from '$lib/store/index';
	import { columnsToTiles, createPuzzle, wordsToCols } from '$lib/utils/puzzle';
	import { BLOOM_FILTER_KEY } from '$lib/utils/constants';

	export let words: string[];

	const { state, send } = puzzleMachine;
	const today = new Date().toDateString();

	const cacheBloomFilter = (cache: Writable<BloomFilter>) => {
		let filterJSONStr = localStorage.getItem(BLOOM_FILTER_KEY);
		const bFilter = BloomFilter.fromJSON(JSON.parse(filterJSONStr));
		cache.set(bFilter);
	};

	if (browser) {
		if ($bloomFilter === null) {
			cacheBloomFilter(bloomFilter);
		}
	}

	if ($state.context.totalTiles == 0) {
		const cols = wordsToCols(words);
		const tiles = columnsToTiles(cols);
		const puzzle = createPuzzle(words, $bloomFilter, tiles);
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
