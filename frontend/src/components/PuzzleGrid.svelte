<script lang="ts">
	import PuzzleRow from './PuzzleColumn.svelte';

	const getLetter = (i: number): string => String.fromCharCode(65 + i);
	const getRandomNumber = () => Math.floor(Math.random() * 4) + 3;
	const cols = new Array(5)
		.fill([])
		.map((_, i) => new Array(getRandomNumber()).fill('').map((_, j) => getLetter(j * 5 + i)));
</script>

<div class="flex justify-center relative h-12 overflow-visible">
	<div class="absolute w-full bg-white h-12 bg-opacity-30" />
	{#each cols as col}
		<PuzzleRow letters={col} />
	{/each}
</div>
