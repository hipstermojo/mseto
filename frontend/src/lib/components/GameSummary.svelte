<script lang="ts">
	import { puzzleMachine } from '$lib/store';

	import { fade } from 'svelte/transition';

	const { state } = puzzleMachine;

	const {
		context: {
			solutions: { core, extra },
			foundWords
		}
	} = $state;

	const coreWords = Array.from(core);
	const extraWordsFound = [...foundWords].filter((word) => extra.has(word));
</script>

<div
	transition:fade|local={{ delay: 1000, duration: 300 }}
	id="game-over"
	class="absolute h-screen w-full bg-primary text-white pt-40 flex flex-col items-center p-4"
>
	<h2 class="text-3xl mb-4">Puzzle completed!</h2>
	<p class="text-lg mb-16">Come back tomorrow for a new one</p>
	<div class="w-full mb-4">
		<h2 class="text-2xl text-center font-semibold text-opacity-50 text-white mb-1">
			Core words found
		</h2>
		<ul class="flex w-full justify-center flex-wrap">
			{#each coreWords as word}
				<li class="mr-2 text-lg text-white" class:text-opacity-30={!foundWords.has(word)}>
					{word}
				</li>
			{/each}
		</ul>
	</div>
	<div class="w-full">
		<h2 class="text-2xl text-center font-semibold text-opacity-50 text-white mb-1">
			Additional words found
		</h2>
		<ul class="flex w-full justify-center flex-wrap">
			{#each extraWordsFound as word}
				<li class="mr-2 text-lg">{word}</li>
			{/each}
		</ul>
	</div>
</div>
